"use client";

import { useEffect, useState } from "react";
import { getVideos } from "../../services/videoService";
import VideoCard from "./VideoCard";
import { API_BASE_URL } from "../../lib/api-config";

export default function VideoFeed({ feedType = "all" }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVideos();
        setVideos(data || []);
      } catch (err) {
        console.error("Error loading videos:", err);
        setError("Failed to load videos. Make sure your backend is running.");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [feedType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <p className="text-sm mt-2">API base URL: {API_BASE_URL}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {videos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No videos yet. Be the first to upload!</p>
        </div>
      ) : (
        videos.map((video) => <VideoCard key={video.id} video={video} />)
      )}
    </div>
  );
}
