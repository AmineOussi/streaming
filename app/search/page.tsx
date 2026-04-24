import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { searchMulti, fetchPopularMovies, fetchPopularShows, getImageUrl } from "@/lib/tmdb";
import type { Movie } from "@/lib/types";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q} — StreamVault` : "Browse — StreamVault",
  };
}

async function SearchResults({ query, type }: { query?: string; type?: string }) {
  let results: Movie[] = [];
  let title = "Trending & Popular";

  if (query && query !== "trending") {
    const data = await searchMulti(query);
    results = (data.results || []).filter(
      (r: Movie) => (r.media_type === "movie" || r.media_type === "tv") && (r.poster_path || r.backdrop_path)
    );
    title = `Results for "${query}"`;
  } else if (type === "movie") {
    const data = await fetchPopularMovies();
    results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "movie" as const }));
    title = "Popular Movies";
  } else if (type === "tv") {
    const data = await fetchPopularShows();
    results = (data.results || []).map((m: Movie) => ({ ...m, media_type: "tv" as const }));
    title = "Popular TV Shows";
  } else {
    const [movies, shows] = await Promise.all([
      fetchPopularMovies().then((r) => (r.results || []).slice(0, 10).map((m: Movie) => ({ ...m, media_type: "movie" as const }))),
      fetchPopularShows().then((r) => (r.results || []).slice(0, 10).map((m: Movie) => ({ ...m, media_type: "tv" as const }))),
    ]);
    results = [...movies, ...shows].sort((a, b) => b.popularity - a.popularity);
    title = "Popular Right Now";
  }

  return (
    <div>
      <h1 className="text-white font-bold text-xl md:text-2xl mb-6">{title}</h1>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <FiSearch className="text-gray-600 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">No results found for &ldquo;{query}&rdquo;</p>
          <p className="text-gray-600 text-sm mt-2">Try a different title or keyword</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {results.map((item) => (
            <SearchCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchCard({ item }: { item: Movie }) {
  const type = item.media_type || "movie";
  const title = item.title || item.name || "Unknown";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const score = item.vote_average?.toFixed(1);

  return (
    <Link href={`/${type}/${item.id}`} className="group block">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-2">
        {item.poster_path ? (
          <Image
            src={getImageUrl(item.poster_path, "w300")}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          />
        ) : item.backdrop_path ? (
          <Image
            src={getImageUrl(item.backdrop_path, "w500")}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 200px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs text-center p-3">
            {title}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-semibold">
            View Details
          </div>
        </div>

        {/* Type badge */}
        {type === "tv" && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
            Series
          </div>
        )}
      </div>

      <p className="text-white text-xs font-semibold line-clamp-2 leading-snug mb-0.5">{title}</p>
      <div className="flex items-center gap-2 text-[11px] text-gray-500">
        {year && <span>{year}</span>}
        {score && score !== "0.0" && (
          <span className="flex items-center gap-0.5 text-yellow-500">
            <FaStar size={9} />
            {score}
          </span>
        )}
      </div>
    </Link>
  );
}

function SearchSkeleton() {
  return (
    <div>
      <div className="h-7 w-48 skeleton mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[2/3] skeleton rounded-lg mb-2" />
            <div className="h-3 skeleton mb-1 w-3/4" />
            <div className="h-3 skeleton w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, type } = await searchParams;

  return (
    <div className="min-h-screen bg-[#141414] pt-24 px-4 md:px-12 pb-12">
      {/* Search bar */}
      <SearchBar initialQuery={q} />

      {/* Type filters */}
      <div className="flex gap-2 mb-8">
        {[
          { label: "All", href: "/search" },
          { label: "Movies", href: "/search?type=movie" },
          { label: "TV Shows", href: "/search?type=tv" },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (tab.label === "All" && !type && !q) ||
              (tab.label === "Movies" && type === "movie") ||
              (tab.label === "TV Shows" && type === "tv")
                ? "bg-white text-black"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={q} type={type} />
      </Suspense>
    </div>
  );
}

function SearchBar({ initialQuery }: { initialQuery?: string }) {
  return (
    <form method="GET" action="/search" className="mb-6">
      <div className="relative max-w-2xl">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          name="q"
          defaultValue={initialQuery}
          placeholder="Search movies, shows, actors..."
          className="w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 pl-12 pr-4 py-3 text-base focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white font-semibold text-sm px-4 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
