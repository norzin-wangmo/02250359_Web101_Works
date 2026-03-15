import VideoFeed from "../components/ui/VideoFeed"

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">For You</h1>
      <VideoFeed />
    </div>
  )
}