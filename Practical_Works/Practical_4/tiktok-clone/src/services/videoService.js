import api from "../lib/api-config";

export const getVideos = async () => {
  const response = await api.get("/videos");
  return response.data;
};

export const getFollowingVideos = async () => {
  const response = await api.get("/videos/following");
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

export const uploadVideo = async (formData) => {
  const response = await api.post("/videos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};