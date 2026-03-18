import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
  {
    title: "安装 (Installation)",
    href: "/guide/installation",
  },
  {
    title: "渲染原理 (Rendering)",
    href: "/guide/rendering",
  },
  {
    title: "基础用法 (Usage)",
    href: "/guide/usage",
  },
  {
    title: "属性 (Props)",
    href: "/guide/props",
  },
  {
    title: "CLI 工具",
    href: "/guide/cli",
  },
];

export default function GuideLayout() {
  const location = useLocation();

  if (location.pathname === "/guide" || location.pathname === "/guide/") {
    return <Navigate to="/guide/installation" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto py-8 px-4 md:px-8">
      <aside className="md:w-64 shrink-0">
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 md:sticky md:top-24 scrollbar-hide">
          {sidebarNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted/50 whitespace-nowrap",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  )
                }
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        </aside>
      
      <main className="flex-1 min-w-0 flex flex-col gap-6">
        <Outlet />
      </main>
    </div>
  );
}
