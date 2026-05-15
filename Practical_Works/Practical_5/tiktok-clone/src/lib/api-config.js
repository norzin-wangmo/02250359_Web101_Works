import axios from "axios";

const raw =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL?.trim()) ||
  "http://localhost:5050/api";

const API_BASE_URL = raw.replace(/\/$/, "");

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

/** API host without `/api` — used for media rewrites and absolute URLs. */
export function getApiOrigin() {
  return API_BASE_URL.replace(/\/api\/?$/i, "").replace(/\/$/, "") || "http://localhost:5050";
}

export function resolveAbsoluteMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const origin = getApiOrigin();
  return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`;
}

/**
 * Align stored **app upload** URLs with this app’s `NEXT_PUBLIC_API_URL` origin
 * so Next rewrites and the video proxy hit the same host as API calls.
 * Leaves unrelated absolute URLs (e.g. sample CDNs) unchanged.
 * Fixes mistaken `/api/uploads/...` (static files are `/uploads/...`, not under `/api`).
 */
export function normalizeStoredMediaUrl(url) {
  const abs = resolveAbsoluteMediaUrl(url);
  if (!abs) return "";
  try {
    const u = new URL(abs);
    let path = u.pathname.replace(/^\/api\/uploads\//i, "/uploads/");
    if (!path.toLowerCase().includes("/uploads/")) {
      return abs;
    }
    const origin = getApiOrigin();
    return `${origin}${path}${u.search}${u.hash}`;
  } catch {
    return abs;
  }
}

/**
 * Same-origin URL for <video src> via next.config rewrites `/media/*` → API `/uploads/*`.
 * External HTTPS URLs (e.g. sample streams) are returned unchanged.
 */
export function playbackSrc(url) {
  const abs = normalizeStoredMediaUrl(url);
  const lower = abs.toLowerCase();
  const marker = "/uploads/";
  const idx = lower.indexOf(marker);
  if (idx === -1) return abs;
  const rest = abs.slice(idx + marker.length);
  return `/media/${rest}`;
}

export { API_BASE_URL };
export default api;
