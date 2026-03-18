import { Link } from "react-router-dom";
import { ArrowRight, Package, Terminal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-8">
      <section className="flex flex-col items-start gap-6 lg:py-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Lucide React Taro
        </h1>
        <p className="text-xl text-muted-foreground max-w-[700px]">
          Beautiful & consistent icons for Taro applications. Built on top of Lucide.
          Supports tree-shaking, dynamic colors, and stroke customization.
        </p>
        <div className="flex gap-4">
          <Link to="/icons">
            <Button size="lg" className="gap-2">
              Browse Icons <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a
            href="https://github.com/louisyoungx/lucide-react-taro"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="lg" variant="outline" className="gap-2">
              GitHub <Package className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">Lightweight</h3>
          <p className="text-muted-foreground">
            Optimized for Taro mini-programs with tree-shaking support to keep your
            bundle size small.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">Easy to Use</h3>
          <p className="text-muted-foreground">
            Simple API similar to lucide-react. Just import and use.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Terminal className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">CLI Tools</h3>
          <p className="text-muted-foreground">
            Includes CLI tools for easy integration and icon management in your Taro
            projects.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight">Installation</h2>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            pnpm add lucide-react-taro
          </code>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold tracking-tight">Usage</h2>
        <div className="rounded-lg border bg-card p-6 shadow-sm overflow-x-auto">
          <pre className="text-sm">
            <code>{`import { Camera } from 'lucide-react-taro';

export default function Demo() {
  return <Camera color="red" size={48} />
}`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
