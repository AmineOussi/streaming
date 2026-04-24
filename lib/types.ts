export interface Movie {
  id: number;
  title: string;
  name?: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  adult: boolean;
  media_type?: "movie" | "tv";
  popularity: number;
  imdb_id?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status: string;
  tagline?: string;
  homepage?: string;
  spoken_languages: { english_name: string; iso_639_1: string }[];
  production_countries: { name: string }[];
  budget?: number;
  revenue?: number;
  imdb_id?: string;
}

export interface ExternalIds {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

export interface OmdbData {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons?: string;
  Response: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface MovieRow {
  title: string;
  fetchUrl: string;
  mediaType?: "movie" | "tv";
}
