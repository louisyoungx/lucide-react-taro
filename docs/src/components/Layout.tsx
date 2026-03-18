import { Link, Outlet } from "react-router-dom";
import { Github, Menu } from "lucide-react";
import { Button } from "./ui/button";

export function Layout() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold sm:inline-block">
                lucide-react-taro
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-6">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                to="/icons"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                图标
              </Link>
              <Link
                to="/guide"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                指南
              </Link>
              <Link
                to="/license"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                开源协议
              </Link>
            </nav>
            <nav className="flex items-center">
              <a
                href="https://github.com/louisyoungx/lucide-react-taro"
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </div>
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto max-w-screen-2xl px-4 md:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
