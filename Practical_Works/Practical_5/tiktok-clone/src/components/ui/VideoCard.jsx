"use client";

import { useState } from "react";

function pickVideoUrl(video) {
  if (!video || typeof video !== "object") return "";

  return (
    video.url ||
    video.videoUrl ||
    video.fileUrl ||
    video.src ||
    video.path ||
    ""
  );
}

export default function VideoCard({ video }) {
  const [liked, setLiked] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  const videoUrl = pickVideoUrl(video);

  return (
    <div className="mx-auto my-6 max-w-[420px] rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-white shadow-lg">
      {videoUrl ? (
        <video
          controls
          playsInline
          preload="metadata"
          className="h-[260px] w-full bg-black object-contain"
          src={videoUrl}
          onError={() => setMediaError(true)}
        />
      ) : (
        <div className="flex h-[200px] items-center justify-center bg-black text-sm text-neutral-400">
          No video URL found.
        </div>
      )}

      {mediaError && (
        <p className="mt-2 text-sm text-amber-300">
          Video playback failed. Try using a different public video URL.
        </p>
      )}

      <h3 className="mt-3 text-lg font-semibold">
        {video?.caption || video?.title || "Video"}
      </h3>

      <button
        type="button"
        onClick={() => setLiked(!liked)}
        className="mt-2 rounded bg-neutral-800 px-3 py-1 text-sm hover:bg-neutral-700"
      >
        {liked ? "❤️ Liked" : "🤍 Like"}
      </button>
    </div>
  );
}