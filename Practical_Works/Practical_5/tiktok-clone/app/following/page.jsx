"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/authContext";

const VideoFeed = dynamic(() => import("@/components/ui/VideoFeed"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center p-8">
      <p className="text-gray-500">Loading feed...</p>
    </div>
  ),
});

export default function Following() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Following</h1>
      {user ? (
        <VideoFeed feedType="following" />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-2">Please login to view your following feed</p>
        </div>
      )}
    </div>
  );
}
