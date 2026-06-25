export interface GenreFilter {
  name: string;
  movieId?: number;
  tvId?: number;
}

export const GENRES: GenreFilter[] = [
  { name: "Action", movieId: 28, tvId: 10759 },
  { name: "Adventure", movieId: 12, tvId: 10759 },
  { name: "Animation", movieId: 16, tvId: 16 },
  { name: "Comedy", movieId: 35, tvId: 35 },
  { name: "Crime", movieId: 80, tvId: 80 },
  { name: "Documentary", movieId: 99, tvId: 99 },
  { name: "Drama", movieId: 18, tvId: 18 },
  { name: "Family", movieId: 10751, tvId: 10751 },
  { name: "Fantasy", movieId: 14, tvId: 10765 },
  { name: "History", movieId: 36 },
  { name: "Horror", movieId: 27 },
  { name: "Music", movieId: 10402, tvId: 10402 },
  { name: "Mystery", movieId: 9648, tvId: 9648 },
  { name: "Romance", movieId: 10749 },
  { name: "Sci-Fi", movieId: 878, tvId: 10765 },
  { name: "Thriller", movieId: 53 },
  { name: "War", movieId: 10752, tvId: 10768 },
  { name: "Western", movieId: 37, tvId: 37 },
];

export function getGenreNameById(
  id: number,
  mediaType: "movie" | "tv"
): string | undefined {
  const genre = GENRES.find((g) =>
    mediaType === "tv" ? g.tvId === id : g.movieId === id
  );
  return genre?.name;
}

export function matchesGenre(
  genreIds: number[] | undefined,
  mediaType: "movie" | "tv" | undefined,
  genreName: string
): boolean {
  const genre = GENRES.find((g) => g.name === genreName);
  if (!genre || !genreIds) return false;
  const id = mediaType === "tv" ? genre.tvId : genre.movieId;
  if (id === undefined) return false;
  return genreIds.includes(id);
}
