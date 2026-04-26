"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlay, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
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
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (featured.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
      setLiked(false);
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
    <div className="px-4 pt-4 pb-2">
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
          className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 pb-4"
          style={{ paddingRight: "calc(88px + 28px)" }}
        >
          <Link
            href={`/${mediaType}/${movie.id}`}
            className="flex items-center gap-3 group min-w-0"
          >
            <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-black/70 transition-colors shrink-0">
              <FaPlay size={11} className="text-white ml-0.5" />
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-white font-bold text-sm md:text-base line-clamp-1">
                {title}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">Play trailer</p>
            </div>
          </Link>

          <button
            onClick={() => setLiked(!liked)}
            className={`w-9 h-9 rounded-full border backdrop-blur-sm flex items-center justify-center transition-colors shrink-0 ml-3 ${
              liked
                ? "bg-red-600/40 border-red-400 text-red-400"
                : "bg-black/40 border-white/20 text-white/70 hover:text-white hover:border-white/50"
            }`}
          >
            {liked ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-black/55 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-0.5">
      {children}
    </span>
  );
}
