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
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const score =
    movie.vote_average && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : null;

  return (
    <div ref={containerRef} className="px-4 pt-4 pb-2">
      <div
        className="relative rounded-2xl overflow-hidden w-full"
        style={{ height: "clamp(1000px, 50vh, 460px)" }}
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

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Tags — top left */}
        <div className="absolute top-3.5 left-4 flex items-center gap-1.5">
          <Tag>{mediaType === "tv" ? "Series" : "Movie"}</Tag>
          {year && <Tag>{year}</Tag>}
          {score && (
            <Tag>
              <FaStar size={9} className="inline mr-0.5 text-yellow-400" />
              {score}
            </Tag>
          )}
        </div>

        {/* Pagination dots — top right */}
        {featured.length > 1 && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIndex(i);
                  setLiked(false);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/30 hover:bg-white/55"
                }`}
              />
            ))}
          </div>
        )}

        

        {/* Bottom row — padded right so it never overlaps the poster */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 pb-12"
          style={{ paddingRight: "calc(88px + 28px)" }}
        >
          <Link
            href={`/${mediaType}/${movie.id}`}
            className="flex items-center gap-2 bg-white text-black font-bold px-7 py-2.5 rounded text-base hover:bg-white/85 transition-colors"
          >
            <FaPlay size={14} />
            Play
          </Link>
          <Link
            href={`/${mediaType}/${movie.id}`}
            className="flex items-center gap-2 bg-white/25 text-white font-semibold px-7 py-2.5 rounded text-base hover:bg-white/35 transition-colors backdrop-blur-sm"
          >
            <FiInfo size={17} />
            More Info
          </Link>
        </div>
      </div>

      {/* Bottom-right: volume + rating */}
      <div className="absolute bottom-16 right-6 md:right-10 z-10 flex items-center gap-3">
        <button
          onClick={() => setMuted(!muted)}
          className="w-9 h-9 rounded-full border border-white/50 flex items-center justify-center text-white hover:border-white transition-colors"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
        </button>
        <div className="h-7 w-px bg-white/30" />
        <span className="border border-white/50 text-white/80 text-sm font-medium px-2.5 py-1 rounded">
          18+
        </span>
      </div>

      {/* Scroll-down arrow */}
      <button
        onClick={scrollDown}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-colors animate-bounce z-10"
        aria-label="Scroll to content"
      >
        <FiChevronDown size={16} />
      </button>
    </div>
  );
}
