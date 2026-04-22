"use client";

import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import api from "@/lib/api-config";

export default function VideoFeed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const res = await api.get("/videos");
      setVideos(res.data);
    } catch (err) {
      console.log("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading videos...</p>;
  }

  return (
    <div className="max-w-[550px] mx-auto py-8">
      {videos.length > 0 ? (
        videos.map((video) => (
          <VideoCard key={video.id || video._id} post={video} />
        ))
      ) : (
        <p className="text-center">No videos found.</p>
      )}
    </div>
  );
}