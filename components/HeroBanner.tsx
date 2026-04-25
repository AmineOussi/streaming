"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlay, FaHeart, FaRegHeart } from "react-icons/fa";
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
  const score = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <div className="px-6 pt-4 pb-2">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: "clamp(260px, 42vh, 400px)" }}
      >
        {/* Backdrop */}
        {movie.backdrop_path ? (
          <Image
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={title}
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        {/* Tags — top left */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 flex-wrap">
          <Tag>{mediaType === "tv" ? "Series" : "Movie"}</Tag>
          {year && <Tag>{year}</Tag>}
          {score && parseFloat(score) > 0 && <Tag>★ {score}</Tag>}
        </div>

        {/* Pagination dots — top right */}
        {featured.length > 1 && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIndex(i); setLiked(false); }}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-5 h-2 bg-white"
                    : "w-2 h-2 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
          <Link
            href={`/${mediaType}/${movie.id}`}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/35 transition-colors shrink-0">
              <FaPlay size={11} className="text-white ml-0.5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm md:text-base leading-tight line-clamp-1 max-w-[250px] md:max-w-xs">
                {title}
              </p>
              <p className="text-gray-300 text-xs mt-0.5">Play trailer</p>
            </div>
          </Link>

          <button
            onClick={() => setLiked(!liked)}
            className={`w-9 h-9 rounded-full border backdrop-blur-sm flex items-center justify-center transition-colors shrink-0 ${
              liked
                ? "bg-red-600/40 border-red-400 text-red-400"
                : "bg-black/20 border-white/30 text-white/70 hover:text-white hover:border-white/60"
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
    <span className="bg-black/50 backdrop-blur-sm border border-white/15 text-white text-xs font-medium px-2.5 py-1 rounded-full">
      {children}
    </span>
  );
}
