"use client";

import { useRouter } from "next/navigation";
import { GENRES } from "@/lib/genres";

interface Props {
  query?: string;
  type?: string;
  genre?: string;
}

export default function GenreFilterSelect({ query, type, genre }: Props) {
  const router = useRouter();

  function onChange(value: string) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type) params.set("type", type);
    if (value) params.set("genre", value);
    const qs = params.toString();
    router.push(`/search${qs ? `?${qs}` : ""}`);
  }

  return (
    <select
      value={genre ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10 focus:outline-none focus:border-white/40 transition-colors"
    >
      <option value="" className="bg-[#0e1520]">
        All Genres
      </option>
      {GENRES.map((g) => (
        <option key={g.name} value={g.name} className="bg-[#0e1520]">
          {g.name}
        </option>
      ))}
    </select>
  );
}
