import api from "../lib/api-config";

/** @typedef {{ videos: any[]; nextCursor: string | number | null; hasNextPage: boolean }} VideosPage */

/** Some APIs wrap the body as `{ data: ... }`. */
function unwrapPayload(raw) {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) return raw;
  if ("data" in raw && raw.data !== undefined && raw.data !== null) {
    return raw.data;
  }
  return raw;
}

function normalizeServerPage(data) {
  const d = unwrapPayload(data);
  if (!d) {
    return { videos: [], nextCursor: null, hasNextPage: false };
  }
  if (Array.isArray(d)) {
    return { videos: d, nextCursor: null, hasNextPage: false };
  }
  const videos = Array.isArray(d.videos) ? d.videos : [];
  const nextCursor = d.nextCursor ?? null;
  const hasNextPage = Boolean(d.hasNextPage);
  return { videos, nextCursor, hasNextPage };
}

/**
 * For You feed — supports:
 * - Cursor API: `{ videos, nextCursor, hasNextPage }` (passes `cursor` query param)
 * - Legacy: bare `Video[]` — fetches once and slices client-side using numeric `pageParam` offsets
 */
export const getVideosPage = async ({ pageParam = null, limit = 10 } = {}) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));

  const isNumericOffset =
    typeof pageParam === "number" ||
    (typeof pageParam === "string" && pageParam !== "" && /^\d+$/.test(pageParam));

  const isServerCursor =
    pageParam != null &&
    pageParam !== "" &&
    typeof pageParam === "string" &&
    !/^\d+$/.test(pageParam);

  if (isServerCursor) {
    params.set("cursor", pageParam);
  }

  const response = await api.get(`/videos?${params.toString()}`);
  let raw = unwrapPayload(response.data);

  if (Array.isArray(raw)) {
    const offset = isNumericOffset ? Number(pageParam) : 0;
    const slice = raw.slice(offset, offset + limit);
    const next = offset + slice.length;
    return {
      videos: slice,
      nextCursor: next < raw.length ? next : null,
      hasNextPage: next < raw.length,
    };
  }

  return normalizeServerPage(raw);
};

/**
 * Following feed — same dual-mode behaviour as `getVideosPage`.
 */
export const getFollowingVideosPage = async ({ pageParam = null, limit = 10 } = {}) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));

  const isNumericOffset =
    typeof pageParam === "number" ||
    (typeof pageParam === "string" && pageParam !== "" && /^\d+$/.test(pageParam));

  const isServerCursor =
    pageParam != null &&
    pageParam !== "" &&
    typeof pageParam === "string" &&
    !/^\d+$/.test(pageParam);

  if (isServerCursor) {
    params.set("cursor", pageParam);
  }

  const response = await api.get(`/videos/following?${params.toString()}`);
  let raw = unwrapPayload(response.data);

  if (Array.isArray(raw)) {
    const offset = isNumericOffset ? Number(pageParam) : 0;
    const slice = raw.slice(offset, offset + limit);
    const next = offset + slice.length;
    return {
      videos: slice,
      nextCursor: next < raw.length ? next : null,
      hasNextPage: next < raw.length,
    };
  }

  return normalizeServerPage(raw);
};

// Get a single video by ID
export const getVideoById = async (videoId) => {
  const response = await api.get(`/videos/${videoId}`);
  return unwrapPayload(response.data);
};

// Get videos by user ID
export const getUserVideos = async (userId) => {
  const response = await api.get(`/videos/user/${userId}`);
  const data = unwrapPayload(response.data);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.videos)) return data.videos;
  return [];
};

// Upload a new video
export const uploadVideo = async (formData) => {
  const response = await api.post("/videos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Like a video
export const likeVideo = async (videoId) => {
  const response = await api.post(`/videos/${videoId}/like`);
  return response.data;
};

// Unlike a video
export const unlikeVideo = async (videoId) => {
  const response = await api.delete(`/videos/${videoId}/like`);
  return response.data;
};

// Add a comment to a video
export const addComment = async (videoId, content) => {
  const response = await api.post(`/videos/${videoId}/comments`, { content });
  return response.data;
};

// Get comments for a video
export const getVideoComments = async (videoId) => {
  const response = await api.get(`/videos/${videoId}/comments`);
  return response.data;
};

// Delete a video
export const deleteVideo = async (videoId) => {
  const response = await api.delete(`/videos/${videoId}`);
  return response.data;
};
