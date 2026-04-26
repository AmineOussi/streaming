"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { FiInfo, FiVolume2, FiVolumeX, FiChevronDown } from "react-icons/fi";
import { Movie } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";

const FEATURED_COUNT = 5;
const AUTO_CYCLE_MS = 7000;

interface Props {
  movies: Movie[];
}

export default function HeroBanner({ movies }: Props) {
  const featured = movies.slice(0, FEATURED_COUNT).filter(Boolean);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  function scrollDown() {
    const next = containerRef.current?.nextElementSibling as HTMLElement | null;
    next?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (featured.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, AUTO_CYCLE_MS);
    return () => clearInterval(t);
  }, [featured.length]);

  const movie = featured[index];
  if (!movie) return null;

  const title = movie.title || movie.name || "Unknown";
  const mediaType = movie.media_type || "movie";

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(400px, 56vw, 760px)" }}
    >
      {/* Backdrop */}
      {movie.backdrop_path ? (
        <Image
          src={getImageUrl(movie.backdrop_path, "original")}
          alt={title}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1520] via-[#0e1520]/20 to-transparent" />

      {/* Pagination dots — top right */}
      {featured.length > 1 && (
        <div className="absolute top-5 right-5 flex items-center gap-1.5 z-10">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/30 hover:bg-white/55"
              }`}
            />
          ))}
        </div>
      )}

      {/* Bottom-left: title + buttons */}
      <div className="absolute bottom-16 left-8 md:left-14 lg:left-16 z-10 max-w-lg md:max-w-3xl lg:max-w-5xl">
        <h1 className="text-7xl md:text-9xl lg:text-9xl font-black text-white leading-none tracking-tight mb-5 drop-shadow-2xl">
          {title}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/${mediaType}/${movie.id}`}
            className="flex items-center gap-2 bg-white text-black font-bold px-9 py-3.5 rounded text-2xl hover:bg-white/85 transition-colors"
          >
            <FaPlay size={20} />
            Play
          </Link>
          <Link
            href={`/${mediaType}/${movie.id}`}
            className="flex items-center gap-2 bg-white/25 text-white font-semibold px-9 py-3.5 rounded text-2xl hover:bg-white/35 transition-colors backdrop-blur-sm"
          >
            <FiInfo size={24} />
            More Info
          </Link>
        </div>
      </div>

      {/* Bottom-right: volume + rating */}
      <div className="absolute bottom-16 right-6 md:right-10 z-10 flex items-center gap-4">
        <button
          onClick={() => setMuted(!muted)}
          className="w-14 h-14 rounded-full border border-white/50 flex items-center justify-center text-white hover:border-white transition-colors"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <FiVolumeX size={28} /> : <FiVolume2 size={28} />}
        </button>
        <div className="h-10 w-px bg-white/30" />
        <span className="border border-white/50 text-white/80 text-xl font-medium px-4 py-2 rounded">
          18+
        </span>
      </div>

      {/* Scroll-down arrow */}
      <button
        onClick={scrollDown}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-colors animate-bounce z-10"
        aria-label="Scroll to content"
      >
        <FiChevronDown size={48} />
      </button>
    </div>
  );
}
