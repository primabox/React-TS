import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    image: "https://picsum.photos/seed/hero1/1600/900",
    label: "New Season",
    heading: "Crafted for\nthe curious",
    sub: "Explore our latest collection of courses and design resources.",
    cta: "Shop Now",
  },
  {
    image: "https://picsum.photos/seed/hero7/1600/900",
    label: "Frontend",
    heading: "Build beautiful\ninterfaces",
    sub: "React, TypeScript, Next.js — everything you need to ship.",
    cta: "Browse Frontend",
  },
  {
    image: "https://picsum.photos/seed/hero42/1600/900",
    label: "Backend",
    heading: "Scale with\nconfidence",
    sub: "Django, Node.js, Kubernetes — build systems that last.",
    cta: "Browse Backend",
  },
  {
    image: "https://picsum.photos/seed/hero99/1600/900",
    label: "Graphics",
    heading: "Design that\nspeaks",
    sub: "Figma, Illustrator, After Effects — make your vision real.",
    cta: "Browse Graphics",
  },
];

interface HeroCarouselProps {
  onCategorySelect?: (cat: string) => void;
}

export default function HeroCarousel({ onCategorySelect }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const go = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((index + SLIDES.length) % SLIDES.length);
        setIsTransitioning(false);
      }, 300);
    },
    [isTransitioning]
  );

  // Auto-advance every 6 seconds
  useEffect(() => {
    const id = setInterval(() => go(current + 1), 6000);
    return () => clearInterval(id);
  }, [current, go]);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full h-[88vh] min-h-130 overflow-hidden bg-zinc-900">
      {/* Background images — preload all, fade active one */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-zinc-950/80 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-8 md:px-16 max-w-7xl mx-auto w-full">
        <div
          key={current}
          className={`transition-all duration-500 ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <p className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase mb-5">
            {slide.label}
          </p>
          <h1 className="text-5xl md:text-7xl font-serif italic font-light text-white leading-[1.05] mb-6 whitespace-pre-line">
            {slide.heading}
          </h1>
          <p className="text-sm text-zinc-300 max-w-sm mb-8 leading-relaxed">
            {slide.sub}
          </p>
          <button
            onClick={() => onCategorySelect?.(slide.label === "New Season" ? "All" : slide.label)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-zinc-900 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-zinc-100 transition-colors duration-200"
          >
            {slide.cta}
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`transition-all duration-300 ${
                i === current
                  ? "w-8 h-0.5 bg-white"
                  : "w-2 h-0.5 bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={() => go(current - 1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hidden md:flex items-center justify-center bg-zinc-950/50 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => go(current + 1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hidden md:flex items-center justify-center bg-zinc-950/50 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
      >
        <ChevronRight size={18} />
      </button>

      {/* Slide counter */}
      <div className="absolute top-6 right-8 z-10 text-[11px] tracking-widest text-zinc-500 font-light">
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </div>
  );
}
