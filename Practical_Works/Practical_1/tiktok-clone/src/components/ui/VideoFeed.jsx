import VideoCard from "./VideoCard"

export default function VideoFeed() {

  const videos = [
    {
      id: 1,
      title: "Pink Flower and Sky Sunset",
      image: "/Images/Flower.jpg",
      creator: "PhotoGrapher YOU",
      avatar: "/Images/profile1.jpg"
    },
    {
      id: 2,
      title: "Love Lilly",
      image: "/Images/lilly.jpg",
      creator: "Flower Enthusiast",
      avatar: "/Images/profile2.jpg"
    },
    {
      id: 3,
      title: "Study Quote",
      image: "/Images/quote.jpg",
      creator: "Study Motivation",
      avatar: "/Images/profile3.jpg"
    }
  ]

  return (
    <div className="flex flex-col items-center">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          title={video.title}
          image={video.image}
          creator={video.creator}
          avatar={video.avatar}
        />
      ))}
    </div>
  )
}