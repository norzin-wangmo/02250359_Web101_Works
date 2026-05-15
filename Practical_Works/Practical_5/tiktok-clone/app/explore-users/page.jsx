"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getUsers, followUser, unfollowUser } from "@/services/userService";
import { useAuth } from "@/contexts/authContext";

export default function ExploreUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followingMap, setFollowingMap] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUsers();
        setUsers(data || []);

        const followMap = {};
        data?.forEach((u) => {
          followMap[u.id] = u.isFollowing || false;
        });
        setFollowingMap(followMap);
      } catch (err) {
        console.error("Error loading users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleFollowClick = async (userId) => {
    if (!user) {
      toast.error("Please login to follow users");
      return;
    }

    try {
      setActionLoading({ ...actionLoading, [userId]: true });

      if (followingMap[userId]) {
        await unfollowUser(userId);
        setFollowingMap({ ...followingMap, [userId]: false });
        toast.success("Unfollowed!");
      } else {
        await followUser(userId);
        setFollowingMap({ ...followingMap, [userId]: true });
        toast.success("Followed!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
      console.error("Follow error:", err);
    } finally {
      setActionLoading({ ...actionLoading, [userId]: false });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Explore Users</h1>

      {users.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    href={`/profile/${u.id}`}
                    className="font-semibold text-lg hover:underline block"
                  >
                    {u.username || u.email}
                  </Link>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  {u.bio && <p className="text-sm text-gray-700 mt-2">{u.bio}</p>}

                  <div className="flex gap-4 mt-3 text-sm text-gray-600">
                    <span>{u.videoCount || 0} videos</span>
                    <span>{u.followerCount || 0} followers</span>
                  </div>
                </div>

                {user?.id !== u.id && (
                  <button
                    onClick={() => handleFollowClick(u.id)}
                    disabled={actionLoading[u.id]}
                    className={`ml-2 px-4 py-2 rounded font-medium text-sm whitespace-nowrap disabled:opacity-50 ${
                      followingMap[u.id]
                        ? "bg-gray-200 text-black hover:bg-gray-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {actionLoading[u.id]
                      ? "..."
                      : followingMap[u.id]
                        ? "Following"
                        : "Follow"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
