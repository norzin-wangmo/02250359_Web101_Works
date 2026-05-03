"use client";

import { useEffect, useState } from "react";
import { getFollowingVideos } from "../../services/videoService";
import VideoCard from "../../components/ui/VideoCard";

export default function Following() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getFollowingVideos();
      setVideos(data);
    };
    load();
  }, []);

  return (
    <div>
      <h1>Following Feed</h1>
      {videos.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </div>
  );
}