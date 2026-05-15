"use client";

import { useMemo, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getVideosPage, getFollowingVideosPage } from "../../services/videoService";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import VideoCard from "./VideoCard";
import { useAuth } from "../../contexts/authContext";

/** Small pages so “load more” appears even with only a few test videos from the API. */
const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_VIDEO_PAGE_SIZE) || 1;
const SCROLL_THRESHOLD_PX = 500;

export default function VideoFeed({ feedType = "all" }) {
  const { user } = useAuth();
  const isFollowingFeed = feedType === "following";

  const query = useInfiniteQuery({
    queryKey: ["videos", feedType, user?.id ?? "guest", PAGE_SIZE],
    enabled: !isFollowingFeed || Boolean(user),
    initialPageParam: null,
    queryFn: ({ pageParam }) => {
      if (isFollowingFeed) {
        return getFollowingVideosPage({ pageParam, limit: PAGE_SIZE });
      }
      return getVideosPage({ pageParam, limit: PAGE_SIZE });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNextPage) return undefined;
      const { nextCursor } = lastPage;
      if (nextCursor === undefined || nextCursor === null) return undefined;
      return nextCursor;
    },
  });

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  const videos = useMemo(
    () => query.data?.pages.flatMap((p) => p.videos ?? []) ?? [],
    [query.data?.pages]
  );

  const tryLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const canLoadMore = Boolean(hasNextPage && !isFetchingNextPage);

  const loadMoreRef = useIntersectionObserver(
    () => {
      tryLoadMore();
    },
    {
      enabled: canLoadMore,
      watchKey: videos.length,
      rootMargin: "600px",
    }
  );

  useEffect(() => {
    if (!canLoadMore) return;
    const onScroll = () => {
      const el = document.documentElement;
      const nearBottom =
        window.innerHeight + window.scrollY >= el.scrollHeight - SCROLL_THRESHOLD_PX;
      if (nearBottom) tryLoadMore();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [canLoadMore, tryLoadMore]);

  if (isFollowingFeed && !user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-2">Please login to view your following feed</p>
      </div>
    );
  }

  if (query.isPending) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500">Loading videos...</p>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Failed to load videos. Start your backend API and set `NEXT_PUBLIC_API_URL` in `.env.local`.</p>
        <p className="text-sm mt-2 text-red-600">{String(query.error?.message || query.error)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {videos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {isFollowingFeed
              ? "No videos from people you follow yet."
              : "No videos yet. Be the first to upload!"}
          </p>
        </div>
      ) : (
        <>
          {videos.map((video, index) => (
            <VideoCard key={`${video.id}-${index}`} video={video} />
          ))}
          <div
            ref={loadMoreRef}
            className="flex min-h-28 flex-col items-center justify-center gap-3 py-8 text-sm text-gray-500"
          >
            {isFetchingNextPage ? (
              <span>Loading more…</span>
            ) : hasNextPage ? (
              <>
                <span>Scroll down, or tap below to load more.</span>
                <button
                  type="button"
                  onClick={() => tryLoadMore()}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  Load more
                </button>
              </>
            ) : (
              <span className="text-gray-400">End of feed</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
