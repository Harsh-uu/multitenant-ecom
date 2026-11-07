import { Logo } from "@/components/logo";
import Link from "next/link";

interface Props {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}

/** Centered auth card on a faint grid, shared by sign-in and sign-up. */
export const AuthShell = ({ title, subtitle, footer, children }: Props) => {
  return (
    <div className="relative flex min-h-screen flex-col bg-subtle">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,#ebebeb_1px,transparent_1px),linear-gradient(to_bottom,#ebebeb_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />
      <header className="relative flex h-16 items-center px-4 lg:px-8">
        <Link href="/" aria-label="Shelf home">
          <Logo />
        </Link>
      </header>
      <main className="relative flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="rounded-xl bg-card p-6 shadow-(--shadow-card)">{children}</div>
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </main>
    </div>
  );
};
