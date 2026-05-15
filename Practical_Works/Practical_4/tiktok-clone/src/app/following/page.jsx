"use client";

import { useEffect, useState } from "react";
import { getFollowingVideos } from "../../services/videoService";
import VideoCard from "../../components/ui/VideoCard";
import { useAuth } from "../../contexts/authContext";
import { API_BASE_URL } from "../../lib/api-config";

export default function Following() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadVideos = async () => {
      if (!user) {
        setError("Please login to see your following feed");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getFollowingVideos();
        setVideos(data || []);
      } catch (err) {
        console.error("Error loading following videos:", err);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-2">Please login to view your following feed</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500">Loading...</p>
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
      <h1 className="text-3xl font-bold mb-6">Following</h1>
      {videos.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-600">
            You&apos;re not following anyone yet. Visit the Explore page to find users to follow!
          </p>
        </div>
      ) : (
        videos.map((video) => <VideoCard key={video.id} video={video} />)
      )}
    </div>
  );
}
