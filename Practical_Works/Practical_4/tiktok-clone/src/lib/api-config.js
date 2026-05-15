import axios from "axios";

const rawBase =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL?.trim()) ||
  "http://localhost:8000/api";

const API_BASE_URL = rawBase.replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(Object.assign(error, { friendlyMessage: message }));
  }
);

/** Origin of the API server (no `/api`), used for media URL resolution and rewrites. */
export function getApiOrigin() {
  return API_BASE_URL.replace(/\/api\/?$/i, "").replace(/\/$/, "") || "http://localhost:8000";
}

/** Turn stored URLs into an absolute URL pointing at the API host. */
export function resolveAbsoluteMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const origin = getApiOrigin();
  return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`;
}

/**
 * Playback URL for <video src>. Proxies `/uploads/...` through this Next app (`/media/...`)
 * so the browser loads media from the same origin as the page (avoids broken relative URLs
 * and many cross-origin playback issues).
 */
export function playbackSrc(url) {
  const abs = resolveAbsoluteMediaUrl(url);
  const marker = "/uploads/";
  const idx = abs.indexOf(marker);
  if (idx === -1) return abs;
  return `/media/${abs.slice(idx + marker.length)}`;
}

export { API_BASE_URL };
export default api;
