"use client";

import Link from "next/link";
import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContentCarousel({
  title,
  href,
  children
}: {
  title: string;
  href: string;
  children: ReactNode;
}) {
  const items = Children.toArray(children);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  function updateScrollState() {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    setCanScrollPrev(scroller.scrollLeft > 4);
    setCanScrollNext(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4);
  }

  function scrollByPage(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.max(280, scroller.clientWidth * 0.85),
      behavior: "smooth"
    });
  }

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [items.length]);

  return (
    <section className="container-page space-y-5">
      <div className="flex min-w-0 items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="section-title min-w-0">{title}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link href={href} className="text-sm font-medium text-primary hover:underline">
            查看全部
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`${title}上一頁`}
              disabled={!canScrollPrev}
              onClick={() => scrollByPage(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`${title}下一頁`}
              disabled={!canScrollNext}
              onClick={() => scrollByPage(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <div key={index} className="min-w-[82%] snap-start sm:min-w-[48%] lg:min-w-[31%]">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
