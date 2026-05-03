"use client";

import { useEffect, useState } from "react";
import { getVideos } from "../../services/videoService";
import VideoCard from "./VideoCard";

export default function VideoFeed() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getVideos();
      setVideos(data);
    };
    load();
  }, []);

  return (
    <div>
      {videos.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </div>
  );
}