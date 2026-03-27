import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type GuidePagerLink = {
  title: string;
  href: string;
};

type GuidePagerProps = {
  previous?: GuidePagerLink;
  next?: GuidePagerLink;
};

export function GuidePager({ previous, next }: GuidePagerProps) {
  if (!previous && !next) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  return (
    <section className="rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {previous ? (
          <Link to={previous.href} onClick={scrollToTop}>
            <Button variant="outline" className="w-full justify-start gap-2 sm:w-auto">
              <ChevronLeft className="h-4 w-4" />
              上一步：{previous.title}
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link to={next.href} onClick={scrollToTop}>
            <Button className="w-full justify-end gap-2 sm:w-auto">
              下一步：{next.title}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
