const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const OMDB_BASE_URL = "https://www.omdbapi.com";

function getApiKey() {
  return process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
}

function getOmdbKey() {
  return process.env.OMDB_API_KEY || process.env.NEXT_PUBLIC_OMDB_API_KEY || "";
}

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const apiKey = getApiKey();
  if (!apiKey) return { results: [] };
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", apiKey);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchTrending(mediaType: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "week") {
  return tmdbFetch(`/trending/${mediaType}/${timeWindow}`);
}

export async function fetchPopularMovies() {
  return tmdbFetch("/movie/popular");
}

export async function fetchTopRatedMovies() {
  return tmdbFetch("/movie/top_rated");
}

export async function fetchPopularShows() {
  return tmdbFetch("/tv/popular");
}

export async function fetchTopRatedShows() {
  return tmdbFetch("/tv/top_rated");
}

export async function fetchMoviesByGenre(genreId: number) {
  return tmdbFetch("/discover/movie", { with_genres: String(genreId), sort_by: "popularity.desc" });
}

export async function fetchShowsByGenre(genreId: number) {
  return tmdbFetch("/discover/tv", { with_genres: String(genreId), sort_by: "popularity.desc" });
}

export async function fetchMovieDetails(id: number) {
  return tmdbFetch(`/movie/${id}`, { append_to_response: "external_ids,videos,credits" });
}

export async function fetchShowDetails(id: number) {
  return tmdbFetch(`/tv/${id}`, { append_to_response: "external_ids,videos,credits" });
}

export async function searchMulti(query: string) {
  return tmdbFetch("/search/multi", { query, include_adult: "false" });
}

export async function fetchOmdbData(imdbId: string) {
  const apiKey = getOmdbKey();
  if (!apiKey || !imdbId) return null;
  try {
    const url = `${OMDB_BASE_URL}/?i=${imdbId}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.Response === "True" ? data : null;
  } catch {
    return null;
  }
}

export function getImageUrl(path: string | null, size: "w300" | "w500" | "w780" | "original" = "w500"): string {
  if (!path) return "/placeholder.svg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export async function fetchNowPlayingMovies() {
  return tmdbFetch("/movie/now_playing");
}

export async function fetchUpcomingMovies() {
  return tmdbFetch("/movie/upcoming");
}

export async function fetchAiringToday() {
  return tmdbFetch("/tv/airing_today");
}

export async function fetchSimilar(mediaType: "movie" | "tv", id: number) {
  return tmdbFetch(`/${mediaType}/${id}/similar`);
}
