"use client";

import dynamic from "next/dynamic";

const VideoFeed = dynamic(() => import("@/components/ui/VideoFeed"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center p-8">
      <p className="text-gray-500">Loading feed...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">For You</h1>
      <VideoFeed feedType="all" />
    </div>
  );
}
