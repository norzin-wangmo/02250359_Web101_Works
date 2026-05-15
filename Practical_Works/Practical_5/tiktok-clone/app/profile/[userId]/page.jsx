"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getUserProfile, followUser, unfollowUser } from "@/services/userService";
import { getUserVideos } from "@/services/videoService";
import VideoCard from "@/components/ui/VideoCard";
import { useAuth } from "@/contexts/authContext";

export default function Profile({ params }) {
  const { userId } = use(Promise.resolve(params));
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await getUserProfile(userId);
        setUser(userData);
        setIsFollowing(userData.isFollowing || false);

        const videosData = await getUserVideos(userId);
        setVideos(videosData || []);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const handleFollowClick = async () => {
    if (!currentUser) {
      toast.error("Please login to follow users");
      return;
    }

    try {
      setActionLoading(true);

      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
        toast.success("Unfollowed!");
      } else {
        await followUser(userId);
        setIsFollowing(true);
        toast.success("Followed!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
      console.error("Follow error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error || "Profile not found"}</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div>
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.username || user.email}</h1>
            <p className="text-gray-600 mb-4">{user.email}</p>
            {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}

            <div className="flex gap-6 text-lg font-semibold">
              <div>
                <span className="text-2xl">{videos.length}</span>
                <p className="text-sm text-gray-600">Videos</p>
              </div>
              <div>
                <span className="text-2xl">{user.followerCount || 0}</span>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div>
                <span className="text-2xl">{user.followingCount || 0}</span>
                <p className="text-sm text-gray-600">Following</p>
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              onClick={handleFollowClick}
              disabled={actionLoading}
              className={`px-6 py-2 rounded-lg font-semibold disabled:opacity-50 ${
                isFollowing
                  ? "bg-gray-200 text-black hover:bg-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {actionLoading ? "..." : isFollowing ? "Following" : "Follow"}
            </button>
          )}

          {isOwnProfile && (
            <Link
              href="/upload"
              className="px-6 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700"
            >
              Upload Video
            </Link>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Videos</h2>
        {videos.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded">
            <p className="text-gray-600">
              {isOwnProfile
                ? "You haven't uploaded any videos yet"
                : "No videos from this user"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
