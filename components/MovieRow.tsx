"use client";

import { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MovieCard from "./MovieCard";
import { Movie } from "@/lib/types";

interface Props {
  title: string;
  movies: Movie[];
  mediaType?: "movie" | "tv";
}

export default function MovieRow({ title, movies, mediaType }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (!movies?.length) return null;

  function scroll(dir: "left" | "right") {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  function onScroll() {
    const el = rowRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }

  return (
    <section className="relative group/row mb-6 md:mb-8">
      <h2 className="text-white font-bold text-base md:text-lg lg:text-xl px-4 md:px-12 mb-3 tracking-wide">
        {title}
      </h2>

      <div className="relative">
        {/* Left arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 w-10 md:w-14 flex items-center justify-center bg-gradient-to-r from-[#141414] to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 hover:from-black"
            aria-label="Scroll left"
          >
            <FiChevronLeft className="text-white" size={28} />
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={rowRef}
          onScroll={onScroll}
          className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.slice(0, 20).map((movie) => (
            <MovieCard key={movie.id} movie={movie} mediaType={mediaType} />
          ))}
        </div>

        {/* Right arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-20 w-10 md:w-14 flex items-center justify-center bg-gradient-to-l from-[#141414] to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 hover:from-black"
            aria-label="Scroll right"
          >
            <FiChevronRight className="text-white" size={28} />
          </button>
        )}
      </div>
    </section>
  );
}
