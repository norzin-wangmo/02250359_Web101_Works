"use client";

import { likeVideo, unlikeVideo } from "../../services/videoService";
import { useState } from "react";

export default function VideoCard({ video }) {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    if (liked) {
      await unlikeVideo(video.id);
    } else {
      await likeVideo(video.id);
    }
    setLiked(!liked);
  };

  return (
    <div className="border p-4 mb-4">
      <video src={video.url} controls className="w-full" />
      <p>{video.caption}</p>

      <button onClick={handleLike}>
        {liked ? "❤️ Unlike" : "🤍 Like"}
      </button>
    </div>
  );
}