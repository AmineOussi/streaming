export const dynamic = "force-dynamic";

import { Suspense } from "react";
import HeroBanner from "@/components/HeroBanner";
import GenreGrid from "@/components/GenreGrid";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchMoviesByGenre,
} from "@/lib/tmdb";
import ApiKeyBanner from "@/components/ApiKeyBanner";

async function HomeContent() {
  const [
    trending,
    popular,
    adventure,
    action,
    comedy,
    crime,
    drama,
    fantasy,
    horror,
  ] = await Promise.all([
    fetchTrending("all", "week").then((r) => r.results || []),
    fetchPopularMovies().then((r) => r.results || []),
    fetchMoviesByGenre(12).then((r) => r.results || []),
    fetchMoviesByGenre(28).then((r) => r.results || []),
    fetchMoviesByGenre(35).then((r) => r.results || []),
    fetchMoviesByGenre(80).then((r) => r.results || []),
    fetchMoviesByGenre(18).then((r) => r.results || []),
    fetchMoviesByGenre(14).then((r) => r.results || []),
    fetchMoviesByGenre(27).then((r) => r.results || []),
  ]);

  const noApiKey = !process.env.TMDB_API_KEY && !process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const genres = [
    { label: "Trending", movies: trending },
    { label: "Adventure", movies: adventure, mediaType: "movie" as const },
    { label: "Action", movies: action, mediaType: "movie" as const },
    { label: "Comedy", movies: comedy, mediaType: "movie" as const },
    { label: "Crime", movies: crime, mediaType: "movie" as const },
    { label: "Drama", movies: drama, mediaType: "movie" as const },
    { label: "Fantasy", movies: fantasy, mediaType: "movie" as const },
    { label: "Horror", movies: horror, mediaType: "movie" as const },
    { label: "Popular", movies: popular, mediaType: "movie" as const },
  ];

  return (
    <>
      {noApiKey && <ApiKeyBanner />}
      {trending.length > 0 ? (
        <HeroBanner movies={trending} />
      ) : (
        <div className="mx-6 mt-4 rounded-2xl h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <p className="text-gray-400">Add your TMDB API key to get started</p>
        </div>
      )}
      <div className="mt-4">
        <GenreGrid genres={genres} />
      </div>
    </>
  );
}

function HomeLoading() {
  return (
    <div className="p-6 space-y-4">
      <div className="rounded-2xl skeleton" style={{ height: "clamp(260px, 42vh, 400px)" }} />
      <div className="flex gap-2 mt-6 mb-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-20 skeleton rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
