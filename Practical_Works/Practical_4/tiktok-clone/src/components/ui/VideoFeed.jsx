"use client";

import { useEffect, useState } from "react";
import { getVideos } from "../../services/videoService";
import VideoCard from "./VideoCard";

export default function VideoFeed() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getVideos();
        setVideos(data || []);
      } catch (error) {
        console.log("Backend not connected yet:", error);
        setVideos([]);
      }
    };

    load();
  }, []);

  return (
    <div>
      {videos.length === 0 ? (
        <p>No videos yet. Check backend connection.</p>
      ) : (
        videos.map((v) => <VideoCard key={v.id} video={v} />)
      )}
    </div>
  );
}