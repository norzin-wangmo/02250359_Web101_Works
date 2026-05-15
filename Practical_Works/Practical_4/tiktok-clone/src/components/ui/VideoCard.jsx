"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { playbackSrc } from "../../lib/api-config";
import {
  likeVideo,
  unlikeVideo,
  getVideoComments,
  addComment,
} from "../../services/videoService";
import { useAuth } from "../../contexts/authContext";

export default function VideoCard({ video }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(Boolean(video.likedByMe));
  const [likeCount, setLikeCount] = useState(video._count?.likes ?? 0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const src = playbackSrc(video.url);

  useEffect(() => {
    setLiked(Boolean(video.likedByMe));
    setLikeCount(video._count?.likes ?? 0);
  }, [video.id, video.likedByMe, video._count?.likes]);

  const loadComments = useCallback(async () => {
    try {
      setCommentsLoading(true);
      const data = await getVideoComments(video.id);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error(err.friendlyMessage || "Could not load comments");
    } finally {
      setCommentsLoading(false);
    }
  }, [video.id]);

  useEffect(() => {
    if (commentsOpen) loadComments();
  }, [commentsOpen, loadComments]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("Please log in to like videos");
      return;
    }
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    try {
      if (next) {
        const res = await likeVideo(video.id);
        setLikeCount(res.likeCount ?? 0);
        setLiked(true);
      } else {
        const res = await unlikeVideo(video.id);
        setLikeCount(res.likeCount ?? 0);
        setLiked(false);
      }
    } catch (err) {
      setLiked(!next);
      setLikeCount((c) => (next ? Math.max(0, c - 1) : c + 1));
      toast.error(err.friendlyMessage || "Could not update like");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    const text = commentText.trim();
    if (!text) return;
    try {
      setSubmitting(true);
      const created = await addComment(video.id, text);
      setComments((prev) => [...prev, created]);
      setCommentText("");
      toast.success("Comment added");
    } catch (err) {
      toast.error(err.friendlyMessage || "Could not add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const author = video.user?.username || video.user?.email || "Unknown user";

  return (
    <div className="max-w-[420px] mx-auto my-6 bg-neutral-900 text-white rounded-lg overflow-hidden shadow-lg border border-neutral-800">
      <div className="px-3 py-2 text-sm text-neutral-300 border-b border-neutral-800">
        <span className="font-semibold text-white">{author}</span>
      </div>

      <video
        key={src}
        src={src}
        controls
        playsInline
        preload="metadata"
        className="w-full h-[260px] bg-black object-contain"
      />

      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold leading-snug">{video.caption}</h3>
        {video.description ? (
          <p className="text-sm text-neutral-400">{video.description}</p>
        ) : null}

        <div className="flex items-center gap-4 text-sm">
          <button
            type="button"
            onClick={handleLikeToggle}
            className="flex items-center gap-1 rounded-full bg-neutral-800 px-3 py-1 hover:bg-neutral-700"
          >
            <span>{liked ? "❤️" : "🤍"}</span>
            <span>{likeCount} likes</span>
          </button>
          <button
            type="button"
            onClick={() => setCommentsOpen((o) => !o)}
            className="rounded-full bg-neutral-800 px-3 py-1 hover:bg-neutral-700"
          >
            {commentsOpen ? "Hide comments" : `Comments (${video._count?.comments ?? "…"})`}
          </button>
        </div>

        {commentsOpen && (
          <div className="border-t border-neutral-800 pt-3 space-y-3">
            {commentsLoading ? (
              <p className="text-sm text-neutral-400">Loading comments…</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-neutral-400">No comments yet.</p>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto text-sm">
                {comments.map((c) => (
                  <li key={c.id} className="bg-neutral-800/80 rounded p-2">
                    <span className="font-medium text-neutral-200">
                      {c.user?.username || c.user?.email || "User"}
                    </span>
                    <span className="text-neutral-400"> · </span>
                    <span>{c.content}</span>
                  </li>
                ))}
              </ul>
            )}

            {user ? (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  className="flex-1 rounded bg-neutral-800 border border-neutral-700 px-2 py-1 text-sm"
                  placeholder="Add a comment…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded bg-blue-600 px-3 py-1 text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
                >
                  Post
                </button>
              </form>
            ) : (
              <p className="text-xs text-neutral-500">Log in to leave a comment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
