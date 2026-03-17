"use client"

import { useState } from "react"

export default function VideoCard({ title, image, creator, avatar }) {

  const [likes, setLikes] = useState(120)
  const [commentsVisible, setCommentsVisible] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState([])

  const handleLike = () => {
    setLikes(likes + 1)
  }

  const handleCommentToggle = () => {
    setCommentsVisible(!commentsVisible)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied!")
  }

  const addComment = () => {
    if(commentText.trim() === "") return

    setComments([...comments, commentText])
    setCommentText("")
  }

  return (
    <div className="flex justify-center mb-12">

      <div className="relative">

        {/* IMAGE */}
        <img
          src={image}
          alt={title}
          className="w-[320px] h-[520px] object-cover rounded-lg shadow-lg"
        />

        {/* CREATOR */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">

          <img
            src={avatar}
            className="w-10 h-10 rounded-full border-2 border-white"
          />

          <div>
            <p className="font-semibold">@{creator}</p>
            <p className="text-sm">{title}</p>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6 text-gray-700">

          <button onClick={handleLike} className="flex flex-col items-center">
            ❤️
            <span>{likes}</span>
          </button>

          <button onClick={handleCommentToggle} className="flex flex-col items-center">
            💬
            <span>{comments.length}</span>
          </button>

          <button onClick={handleShare} className="flex flex-col items-center">
            🔁
            <span>Share</span>
          </button>

        </div>

      </div>

      {/* COMMENT SECTION */}
      {commentsVisible && (
        <div className="ml-6 bg-white p-3 rounded shadow w-60">

          <p className="font-semibold mb-2">Comments</p>

          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e)=>setCommentText(e.target.value)}
              placeholder="Write comment..."
              className="border p-1 w-full"
            />

            <button
              onClick={addComment}
              className="bg-black text-white px-2"
            >
              Post
            </button>
          </div>

          <div className="mt-3 space-y-1 text-sm">
            {comments.map((c,i)=>(
              <p key={i}>• {c}</p>
            ))}
          </div>

        </div>
      )}

    </div>
  )
}