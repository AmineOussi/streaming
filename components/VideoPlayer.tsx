"use client";

import { useState } from "react";

export default function MoviePlayer({ movieId, title }: { movieId: number; title: string }) {
  const [player, setPlayer] = useState<number>(1);

  return (
    <>
      <div className="flex space-x-4 justify-center items-center">
        <button
          className="bg-primary font-bold rounded p-1"
          onClick={() => setPlayer(1)}
        >
          player 1
        </button>
        <button
          className="bg-primary font-bold rounded p-1"
          onClick={() => setPlayer(2)}
        >
          player 2
        </button>
      </div>

      <div className="flex justify-center items-center p-4">
        {player === 1 && (
          <iframe
            allowFullScreen
            className="rounded"
            src={`https://vidsrc-embed.ru/embed/movie?tmdb=${movieId}`}
            title={title}
            width="1000"
            height="600"
          />
        )}

        {player === 2 && (
          <iframe
            allowFullScreen
            className="rounded"
            src={`https://www.2embed.cc/embed/${movieId}`}
            title={title}
            width="1000"
            height="600"
          />
        )}
      </div>
    </>
  );
}
