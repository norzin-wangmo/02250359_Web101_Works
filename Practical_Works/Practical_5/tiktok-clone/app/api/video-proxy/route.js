import { NextResponse } from "next/server";
import { normalizeStoredMediaUrl } from "../../../src/lib/api-config.js";

function apiOriginFromEnv() {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api").replace(/\/$/, "");
  return raw.replace(/\/api\/?$/i, "") || "http://localhost:5050";
}

const LOOPBACK = new Set(["localhost", "127.0.0.1", "::1"]);

function isLoopbackHost(host) {
  const h = (host || "").toLowerCase();
  return LOOPBACK.has(h);
}

/** Treat localhost / 127.0.0.1 / ::1 as the same machine so allowlist matches mixed env + API URLs. */
function sameLogicalOrigin(a, b) {
  try {
    const ua = new URL(a);
    const ub = new URL(b);
    if (ua.protocol !== ub.protocol) return false;
    if (ua.port !== ub.port) return false;
    if (ua.hostname === ub.hostname) return true;
    if (isLoopbackHost(ua.hostname) && isLoopbackHost(ub.hostname)) return true;
    return false;
  } catch {
    return false;
  }
}

function isAllowedVideoTarget(url) {
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") return true;
  if (host.endsWith("googleapis.com") || host.endsWith("googleusercontent.com")) return true;
  try {
    const allowed = new URL(apiOriginFromEnv());
    if (url.origin === allowed.origin) return true;
    return sameLogicalOrigin(url.toString(), allowed.toString());
  } catch {
    return false;
  }
}

/**
 * Same-origin proxy for <video src> so playback works reliably (Range, MIME, fewer browser quirks).
 * Only forwards to hosts we allow (API origin, localhost, common sample CDNs).
 */
export async function GET(request) {
  const param = request.nextUrl.searchParams.get("url");
  if (!param) {
    return NextResponse.json({ message: "missing url" }, { status: 400 });
  }

  let target;
  try {
    target = new URL(param);
  } catch {
    try {
      target = new URL(decodeURIComponent(param));
    } catch {
      return NextResponse.json({ message: "invalid url" }, { status: 400 });
    }
  }

  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json({ message: "unsupported scheme" }, { status: 400 });
  }

  try {
    const normalized = normalizeStoredMediaUrl(target.toString());
    target = new URL(normalized);
  } catch {
    /* keep original target */
  }

  if (!isAllowedVideoTarget(target)) {
    return NextResponse.json({ message: "url host not allowed for proxy" }, { status: 403 });
  }

  const range = request.headers.get("range");
  const upstreamHeaders = new Headers({ Accept: "video/*,*/*" });
  if (range) upstreamHeaders.set("Range", range);
  const cookie = request.headers.get("cookie");
  if (cookie) upstreamHeaders.set("Cookie", cookie);
  const auth = request.headers.get("authorization");
  if (auth) upstreamHeaders.set("Authorization", auth);

  let upstream;
  try {
    upstream = await fetch(target.toString(), { headers: upstreamHeaders });
  } catch (e) {
    return NextResponse.json({ message: e?.message || "fetch failed" }, { status: 502 });
  }

  if (![200, 206].includes(upstream.status)) {
    const snippet = await upstream.text();
    return NextResponse.json(
      {
        message: "upstream rejected video request",
        status: upstream.status,
        detail: snippet?.slice(0, 200),
      },
      { status: upstream.status >= 400 ? upstream.status : 502 }
    );
  }

  const out = new Headers();
  for (const h of ["content-type", "content-length", "content-range", "accept-ranges", "cache-control"]) {
    const v = upstream.headers.get(h);
    if (v) out.set(h, v);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: out,
  });
}
