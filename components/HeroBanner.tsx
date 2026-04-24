"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { Movie } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";

interface Props {
  movies: Movie[];
}

export default function HeroBanner({ movies }: Props) {
  const [muted, setMuted] = useState(true);
  const [featured] = useState(() => movies[Math.floor(Math.random() * Math.min(5, movies.length))]);

  if (!featured) return null;

  const title = featured.title || featured.name || "Unknown";
  const mediaType = featured.media_type || "movie";
  const releaseYear = (featured.release_date || featured.first_air_date || "").slice(0, 4);
  const score = featured.vote_average?.toFixed(1);

  return (
    <div className="relative h-[85vh] min-h-[500px] w-full overflow-hidden">
      {/* Backdrop */}
      {featured.backdrop_path ? (
        <Image
          src={getImageUrl(featured.backdrop_path, "original")}
          alt={title}
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 pb-24 md:pb-32 max-w-2xl">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-3">
          {mediaType === "tv" && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
              Series
            </span>
          )}
          {releaseYear && (
            <span className="text-gray-300 text-sm">{releaseYear}</span>
          )}
          {score && (
            <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {score}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg">
          {title}
        </h1>

        {/* Overview */}
        <p className="text-sm md:text-base text-gray-200 mb-6 line-clamp-3 leading-relaxed max-w-lg drop-shadow">
          {featured.overview}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/${mediaType}/${featured.id}`}
            className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded hover:bg-gray-200 transition-colors text-sm md:text-base"
          >
            <FaPlay className="text-sm" />
            Play
          </Link>
          <Link
            href={`/${mediaType}/${featured.id}`}
            className="flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-2.5 rounded hover:bg-white/30 transition-colors backdrop-blur-sm text-sm md:text-base"
          >
            <FaInfoCircle />
            More Info
          </Link>
        </div>
      </div>

      {/* Mute toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-24 md:bottom-36 right-6 md:right-16 flex items-center justify-center w-10 h-10 rounded-full border border-white/50 text-white hover:bg-white/10 transition-colors"
      >
        {muted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
      </button>
    </div>
  );
}
