import VideoFeed from "../src/components/ui/VideoFeed";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">TikTok Clone</h1>
      <VideoFeed />
    </main>
  );
}