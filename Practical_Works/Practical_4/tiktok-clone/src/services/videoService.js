import api from "../lib/api-config";

/** Backend may return a bare array or a paginated `{ videos }` object. */
export function normalizeVideoList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.videos)) return data.videos;
  return [];
}

// Fetch all videos (For You feed)
export const getVideos = async () => {
  const response = await api.get("/videos");
  return normalizeVideoList(response.data);
};

// Fetch videos from users the current user follows
export const getFollowingVideos = async () => {
  const response = await api.get("/videos/following");
  return normalizeVideoList(response.data);
};

// Get a single video by ID
export const getVideoById = async (videoId) => {
  const response = await api.get(`/videos/${videoId}`);
  return response.data;
};

// Get videos by user ID
export const getUserVideos = async (userId) => {
  const response = await api.get(`/videos/user/${userId}`);
  return normalizeVideoList(response.data);
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
