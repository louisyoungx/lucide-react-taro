import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react-taro";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IconsPage() {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(100);

  const iconList = useMemo(() => {
    return Object.keys(LucideIcons).filter((key) => {
      // Filter out internal helpers and types, keep only PascalCase icon names
      return /^[A-Z]/.test(key) && typeof (LucideIcons as any)[key] === "function";
    });
  }, []);

  const filteredIcons = useMemo(() => {
    if (!query) return iconList;
    const lowerQuery = query.toLowerCase();
    return iconList.filter((name) => name.toLowerCase().includes(lowerQuery));
  }, [query, iconList]);

  const displayedIcons = filteredIcons.slice(0, limit);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Icons</h1>
        <p className="text-muted-foreground">
          {filteredIcons.length} icons found
        </p>
      </div>

      <div className="sticky top-[3.5rem] z-40 bg-background py-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search icons..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(100); // Reset limit on search
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {displayedIcons.map((name) => {
          const Icon = (LucideIcons as any)[name];
          return (
            <Link
              key={name}
              to={`/icons/${name}`}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <div className="h-8 w-8 flex items-center justify-center">
                 <Icon size={24} />
              </div>
              <span className="text-xs text-muted-foreground truncate w-full text-center">
                {name}
              </span>
            </Link>
          );
        })}
      </div>

      {filteredIcons.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          No icons found matching "{query}"
        </div>
      )}

      {displayedIcons.length < filteredIcons.length && (
        <div className="flex justify-center py-8">
          <Button onClick={() => setLimit((prev) => prev + 100)}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
