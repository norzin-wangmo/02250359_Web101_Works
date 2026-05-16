import api from "../lib/api-config";

/** @typedef {{ videos: any[]; nextCursor: string | null; hasNextPage: boolean; pagination?: { nextCursor: string | null; hasNextPage: boolean } }} VideosPage */

/**
 * Normalize cursor pagination from API.
 * Supports `{ videos, nextCursor, hasNextPage }` and `{ videos, pagination: { ... } }`.
 */
function normalizeVideosPage(data) {
  const d = data?.data ?? data;
  if (!d || typeof d !== "object") {
    return { videos: [], nextCursor: null, hasNextPage: false };
  }
  const videos = Array.isArray(d.videos) ? d.videos : [];
  const pagination = d.pagination ?? d;
  return {
    videos,
    nextCursor: pagination.nextCursor ?? null,
    hasNextPage: Boolean(pagination.hasNextPage),
    pagination: {
      nextCursor: pagination.nextCursor ?? null,
      hasNextPage: Boolean(pagination.hasNextPage),
    },
  };
}

/**
 * For You feed — cursor-based pagination (`cursor` + `limit` query params).
 */
export const getVideosPage = async ({ pageParam = null, limit = 10 } = {}) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (pageParam) {
    params.set("cursor", String(pageParam));
  }
  const response = await api.get(`/videos?${params.toString()}`);
  return normalizeVideosPage(response.data);
};

/**
 * Following feed — same cursor contract as For You.
 */
export const getFollowingVideosPage = async ({ pageParam = null, limit = 10 } = {}) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (pageParam) {
    params.set("cursor", String(pageParam));
  }
  const response = await api.get(`/videos/following?${params.toString()}`);
  return normalizeVideosPage(response.data);
};

export const getVideoById = async (videoId) => {
  const response = await api.get(`/videos/${videoId}`);
  return response.data?.data ?? response.data;
};

export const getUserVideos = async (userId) => {
  const response = await api.get(`/videos/user/${userId}`);
  const data = response.data?.data ?? response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.videos)) return data.videos;
  return [];
};

export const uploadVideo = async (formData) => {
  const response = await api.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const likeVideo = async (videoId) => {
  const response = await api.post(`/videos/${videoId}/like`);
  return response.data;
};

export const unlikeVideo = async (videoId) => {
  const response = await api.delete(`/videos/${videoId}/like`);
  return response.data;
};

export const addComment = async (videoId, content) => {
  const response = await api.post(`/videos/${videoId}/comments`, { content });
  return response.data;
};

export const getVideoComments = async (videoId) => {
  const response = await api.get(`/videos/${videoId}/comments`);
  return response.data;
};

export const deleteVideo = async (videoId) => {
  const response = await api.delete(`/videos/${videoId}`);
  return response.data;
};
