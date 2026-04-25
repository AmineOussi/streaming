import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaStar, FaPlay } from "react-icons/fa";
import { FiCalendar, FiClock } from "react-icons/fi";
import { fetchShowDetails, fetchSeasonDetails, getImageUrl } from "@/lib/tmdb";
import type { Metadata } from "next";
import type { Episode } from "@/lib/types";

interface Props {
  params: Promise<{ id: string; seasonNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id, seasonNumber } = await params;
    const [show, season] = await Promise.all([
      fetchShowDetails(Number(id)),
      fetchSeasonDetails(Number(id), Number(seasonNumber)),
    ]);
    return {
      title: `${show.name} — ${season.name} — StreamVault`,
      description: season.overview || show.overview,
    };
  } catch {
    return { title: "Season — StreamVault" };
  }
}

async function SeasonContent({
  showId,
  seasonNumber,
}: {
  showId: number;
  seasonNumber: number;
}) {
  const [show, season] = await Promise.all([
    fetchShowDetails(showId),
    fetchSeasonDetails(showId, seasonNumber),
  ]);

  if (!season || !show) notFound();

  const episodes: Episode[] = season.episodes || [];
  const airYear = season.air_date?.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Backdrop header */}
      <div className="relative h-[30vh] min-h-[200px] overflow-hidden">
        {show.backdrop_path ? (
          <Image
            src={getImageUrl(show.backdrop_path, "original")}
            alt={show.name}
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/60 to-transparent" />

        <Link
          href={`/tv/${showId}`}
          className="absolute top-20 left-4 md:left-12 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm"
        >
          <FaArrowLeft size={12} />
          {show.name}
        </Link>
      </div>

      {/* Content */}
      <div className="px-4 md:px-12 -mt-16 relative z-10 pb-16">
        {/* Season header */}
        <div className="flex gap-5 items-end mb-8 max-w-6xl">
          {season.poster_path && (
            <div className="shrink-0 w-24 md:w-32 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={getImageUrl(season.poster_path, "w300")}
                alt={season.name}
                width={128}
                height={192}
                className="w-full h-auto"
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-gray-400 text-sm mb-0.5">{show.name}</p>
            <h1 className="text-2xl md:text-4xl font-black text-white mb-2">{season.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
              {airYear && (
                <span className="flex items-center gap-1">
                  <FiCalendar size={13} />
                  {airYear}
                </span>
              )}
              <span>
                {episodes.length} Episode{episodes.length !== 1 ? "s" : ""}
              </span>
              {season.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <FaStar size={12} />
                  {season.vote_average.toFixed(1)}
                </span>
              )}
            </div>
            {season.overview && (
              <p className="text-gray-300 text-sm leading-relaxed mt-3 max-w-2xl line-clamp-3">
                {season.overview}
              </p>
            )}
          </div>
        </div>

        {/* Episode list */}
        <div className="max-w-6xl space-y-3">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/tv/${showId}/season/${seasonNumber}/episode/${ep.episode_number}`}
              className="flex gap-0 bg-white/5 hover:bg-white/10 transition-colors rounded-xl overflow-hidden border border-white/5 group"
            >
              {/* Still image */}
              <div className="shrink-0 w-36 md:w-48 aspect-video relative bg-gray-800 overflow-hidden">
                {ep.still_path ? (
                  <Image
                    src={getImageUrl(ep.still_path, "w300")}
                    alt={ep.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 144px, 192px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaPlay size={18} className="text-gray-600" />
                  </div>
                )}
                {/* Hover play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FaPlay size={13} className="text-white ml-0.5" />
                  </div>
                </div>
                {/* Episode number badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded">
                  E{ep.episode_number}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-3 md:p-4 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1">
                    {ep.name}
                  </h3>
                  <div className="shrink-0 flex items-center gap-2 text-xs text-gray-400">
                    {ep.runtime && (
                      <span className="flex items-center gap-1">
                        <FiClock size={11} />
                        {ep.runtime}m
                      </span>
                    )}
                    {ep.vote_average > 0 && (
                      <span className="flex items-center gap-1 text-yellow-400 font-medium">
                        <FaStar size={10} />
                        {ep.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                {ep.air_date && (
                  <p className="text-gray-500 text-xs mb-1.5 flex items-center gap-1">
                    <FiCalendar size={11} />
                    {ep.air_date}
                  </p>
                )}
                {ep.overview && (
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2">
                    {ep.overview}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SeasonPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#141414] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AsyncSeasonPage params={params} />
    </Suspense>
  );
}

async function AsyncSeasonPage({ params }: Props) {
  const { id, seasonNumber } = await params;
  return <SeasonContent showId={Number(id)} seasonNumber={Number(seasonNumber)} />;
}
