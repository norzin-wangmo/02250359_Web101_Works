"use client";

import VideoFeed from "../components/ui/VideoFeed";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">For You</h1>
      <VideoFeed feedType="all" />
    </div>
  );
}
