"use client";

import { useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getVideosPage, getFollowingVideosPage } from "../../services/videoService";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import VideoCard from "./VideoCard";
import { useAuth } from "../../contexts/authContext";

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_VIDEO_PAGE_SIZE) || 10;

export default function VideoFeed({ feedType = "all" }) {
  const { user } = useAuth();
  const isFollowingFeed = feedType === "following";

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["videos", feedType, user?.id ?? "guest", PAGE_SIZE],
    enabled: !isFollowingFeed || Boolean(user),
    initialPageParam: null,
    queryFn: ({ pageParam }) => {
      const args = { pageParam, limit: PAGE_SIZE };
      return isFollowingFeed ? getFollowingVideosPage(args) : getVideosPage(args);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNextPage && !lastPage?.pagination?.hasNextPage) return undefined;
      const cursor = lastPage.pagination?.nextCursor ?? lastPage.nextCursor;
      return cursor ?? undefined;
    },
  });

  const [loadMoreRef, isLoadMoreVisible] = useIntersectionObserver({
    enabled: Boolean(hasNextPage && !isFetchingNextPage),
    rootMargin: "400px",
  });

  useEffect(() => {
    if (isLoadMoreVisible && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [isLoadMoreVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load videos. Please try again.");
      console.error("Error loading videos:", error);
    }
  }, [error]);

  const videos = useMemo(
    () => data?.pages.flatMap((page) => page.videos ?? []) ?? [],
    [data?.pages]
  );

  if (isFollowingFeed && !user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-2">Please login to view your following feed</p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500">Loading videos...</p>
      </div>
    );
  }

  if (status === "error" && !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Failed to load videos. Start the API in `tiktok-api` and check `NEXT_PUBLIC_API_URL`.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isFollowingFeed && data?.pages[0]?.videos?.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          You are not following anyone yet, or they have not posted videos.
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No videos yet. Be the first to upload!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}

      {isFetchingNextPage && (
        <div className="flex justify-center py-6 text-sm text-gray-500">
          Loading more…
        </div>
      )}

      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="h-24" aria-hidden />
      )}

      {!hasNextPage && videos.length > 0 && (
        <p className="py-6 text-center text-sm text-gray-400">
          You have reached the end of the feed.
        </p>
      )}
    </div>
  );
}
