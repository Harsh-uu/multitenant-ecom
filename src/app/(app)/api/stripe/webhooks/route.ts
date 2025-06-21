import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import Stripe from "stripe";
import config from "@payload-config";
import { ExpandedLineItem } from "@/modules/checkout/types";

export async function POST(req: Request) {
  console.log("🔔 Webhook received!");
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.log("❌ Webhook signature verification failed:", error);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  console.log("✅ Success", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "account.updated",
  ];

  const payload = await getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;

          console.log(`🛒 Processing checkout.session.completed event`);
          console.log(`   Session ID: ${data.id}`);
          console.log(
            `   Event account: ${event.account || "null (direct payment - superadmin)"}`
          );
          console.log(`   User ID from metadata: ${data.metadata?.userId}`);

          if (!data.metadata?.userId) {
            throw new Error("User ID is required");
          }
          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });

          if (!user) {
            throw new Error("User not found");
          }

          console.log(
            `   Found user: ${user.email} (Roles: ${user.roles?.join(", ") || "none"})`
          );

          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ["line_items.data.price.product"],
            },
            // Only pass stripeAccount if event.account exists (for connected accounts)
            event.account ? { stripeAccount: event.account } : {}
          );

          console.log(
            `   Retrieved expanded session with ${expandedSession.line_items?.data?.length || 0} line items`
          );
          if (
            !expandedSession.line_items?.data ||
            !expandedSession.line_items.data.length
          ) {
            throw new Error("No line items found");
          }
          const lineItems = expandedSession.line_items
            .data as ExpandedLineItem[];

          console.log(
            `📦 Creating ${lineItems.length} orders for user ${user.email}`
          );

          for (const item of lineItems) {
            console.log(
              `   📝 Creating order for product: ${item.price.product.metadata.id} (${item.price.product.name})`
            );

            const order = await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                stripeAccountId: event.account || null,
                user: user.id,
                product: item.price.product.metadata.id,
                name: item.price.product.name,
              },
            });

            console.log(`   ✅ Order created successfully: ${order.id}`);
          }
          break;

        case "account.updated":
          data = event.data.object as Stripe.Account;

          await payload.update({
            collection: "tenants",
            where: {
              stripeAccountId: {
                equals: data.id,
              },
            },
            data: {
              stripeDetailsSubmitted: data.details_submitted,
            },
          });

          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Received" }, { status: 200 });
}

// Add a GET endpoint to test webhook connectivity
export async function GET() {
  return NextResponse.json({
    message: "Webhook endpoint is working",
    timestamp: new Date().toISOString(),
  });
}
