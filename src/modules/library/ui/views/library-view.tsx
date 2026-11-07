import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { ProductList } from "../components/product-list"
import { Suspense } from "react"
import { ProductListSkeleton } from "../components/product-list"

export const LibraryView = () => {
    return(
    <div className="min-h-screen bg-subtle">
        <nav className="sticky top-0 z-40 h-16 border-b bg-background/80 backdrop-blur-md">
            <div className="max-w-(--breakpoint-xl) mx-auto flex h-full items-center px-4 lg:px-12">
                <Link prefetch href="/" className="flex items-center gap-2 rounded-md px-2 py-1.5 -ml-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                    <ArrowLeftIcon className="size-4"/>
                    Continue shopping
                </Link>
            </div>
        </nav>
        <header className="border-b bg-background py-10">
            <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">Library</h1>
                <p className="text-sm text-muted-foreground">Your purchases and reviews</p>
            </div>
        </header>
        <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
            <Suspense fallback={<ProductListSkeleton/>}>
            <ProductList/>
            </Suspense>
        </section>
    </div>
    )
}