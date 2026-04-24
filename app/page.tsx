export const dynamic = "force-dynamic";

import { Suspense } from "react";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchPopularShows,
  fetchTopRatedShows,
  fetchMoviesByGenre,
  fetchShowsByGenre,
  fetchNowPlayingMovies,
} from "@/lib/tmdb";
import ApiKeyBanner from "@/components/ApiKeyBanner";

// Genre IDs from TMDB
const GENRES = {
  action: 28,
  comedy: 35,
  horror: 27,
  sciFi: 878,
  drama: 18,
  animation: 16,
  thriller: 53,
  documentary: 99,
  crime: 80,
};

const TV_GENRES = {
  actionAdventure: 10759,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  sciFantasy: 10765,
};

async function HomeContent() {
  const [
    trending,
    popularMovies,
    topRatedMovies,
    popularShows,
    topRatedShows,
    actionMovies,
    comedyMovies,
    horrorMovies,
    sciFiMovies,
    thrillerMovies,
    animationMovies,
    nowPlaying,
    crimeShows,
    sciFiShows,
    dramaShows,
  ] = await Promise.all([
    fetchTrending("all", "week").then((r) => r.results || []),
    fetchPopularMovies().then((r) => r.results || []),
    fetchTopRatedMovies().then((r) => r.results || []),
    fetchPopularShows().then((r) => r.results || []),
    fetchTopRatedShows().then((r) => r.results || []),
    fetchMoviesByGenre(GENRES.action).then((r) => r.results || []),
    fetchMoviesByGenre(GENRES.comedy).then((r) => r.results || []),
    fetchMoviesByGenre(GENRES.horror).then((r) => r.results || []),
    fetchMoviesByGenre(GENRES.sciFi).then((r) => r.results || []),
    fetchMoviesByGenre(GENRES.thriller).then((r) => r.results || []),
    fetchMoviesByGenre(GENRES.animation).then((r) => r.results || []),
    fetchNowPlayingMovies().then((r) => r.results || []),
    fetchShowsByGenre(TV_GENRES.crime).then((r) => r.results || []),
    fetchShowsByGenre(TV_GENRES.sciFantasy).then((r) => r.results || []),
    fetchShowsByGenre(TV_GENRES.drama).then((r) => r.results || []),
  ]);

  const noApiKey = !process.env.TMDB_API_KEY && !process.env.NEXT_PUBLIC_TMDB_API_KEY;

  return (
    <>
      {trending.length > 0 ? (
        <HeroBanner movies={trending} />
      ) : (
        <div className="h-[85vh] min-h-[500px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <div className="text-4xl mb-4">🎬</div>
          <h1 className="text-white font-black text-3xl md:text-5xl mb-3">StreamVault</h1>
          <p className="text-gray-400 text-center max-w-sm px-4">Add your TMDB API key to start streaming thousands of titles.</p>
        </div>
      )}

      {noApiKey && <ApiKeyBanner />}

      <div className="relative -mt-20 md:-mt-32 z-10 pb-8">
        <MovieRow title="Trending Now" movies={trending} />
        <MovieRow title="Now Playing in Theaters" movies={nowPlaying} mediaType="movie" />
        <MovieRow title="Popular Movies" movies={popularMovies} mediaType="movie" />
        <MovieRow title="Top Rated Movies" movies={topRatedMovies} mediaType="movie" />
        <MovieRow title="Popular TV Shows" movies={popularShows} mediaType="tv" />
        <MovieRow title="Top Rated TV Shows" movies={topRatedShows} mediaType="tv" />
        <MovieRow title="Action & Adventure" movies={actionMovies} mediaType="movie" />
        <MovieRow title="Comedy" movies={comedyMovies} mediaType="movie" />
        <MovieRow title="Thriller" movies={thrillerMovies} mediaType="movie" />
        <MovieRow title="Sci-Fi & Fantasy" movies={sciFiMovies} mediaType="movie" />
        <MovieRow title="Sci-Fi & Fantasy Shows" movies={sciFiShows} mediaType="tv" />
        <MovieRow title="Horror" movies={horrorMovies} mediaType="movie" />
        <MovieRow title="Crime & Mystery Shows" movies={crimeShows} mediaType="tv" />
        <MovieRow title="Animation" movies={animationMovies} mediaType="movie" />
        <MovieRow title="Drama Series" movies={dramaShows} mediaType="tv" />
      </div>
    </>
  );
}

function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Hero skeleton */}
      <div className="h-[85vh] min-h-[500px] skeleton" />
      <div className="px-4 md:px-12 mt-8 space-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="h-5 w-40 skeleton mb-3" />
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="h-52 w-36 flex-shrink-0 skeleton" />
              ))}
            </div>
          </div>
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
