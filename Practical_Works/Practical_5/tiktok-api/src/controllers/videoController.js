import prisma from "../lib/prisma.js";

const userSelect = { id: true, username: true, email: true };

const videoInclude = {
  user: { select: userSelect },
  _count: { select: { likes: true, comments: true } },
};

function parseLimit(raw) {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1) return 10;
  return Math.min(n, 50);
}

async function attachLikedByMe(viewerId, videos) {
  if (!viewerId || !videos.length) {
    return videos.map((v) => ({ ...v, likedByMe: false }));
  }
  const ids = videos.map((v) => v.id);
  const likes = await prisma.like.findMany({
    where: { userId: viewerId, videoId: { in: ids } },
    select: { videoId: true },
  });
  const set = new Set(likes.map((l) => l.videoId));
  return videos.map((v) => ({ ...v, likedByMe: set.has(v.id) }));
}

function cursorPageResponse(items, limit, hasNextPage) {
  const nextCursor = hasNextPage ? items[items.length - 1].id : null;
  return {
    videos: items,
    nextCursor,
    hasNextPage,
    pagination: { nextCursor, hasNextPage },
  };
}

/**
 * Part 1 — cursor-based pagination (n+1 pattern).
 * Query: ?limit=10&cursor=<videoId>
 */
export async function getAllVideos(req, res) {
  const limit = parseLimit(req.query.limit);
  const cursor = req.query.cursor || undefined;
  const viewerId = req.user?.id;

  try {
    const take = limit + 1;
    const videos = await prisma.video.findMany({
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: videoInclude,
    });

    const hasNextPage = videos.length > limit;
    let items = hasNextPage ? videos.slice(0, limit) : videos;
    items = await attachLikedByMe(viewerId, items);

    res.json(cursorPageResponse(items, limit, hasNextPage));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load videos" });
  }
}

/**
 * Following feed — same cursor contract as getAllVideos.
 */
export async function getFollowingVideos(req, res) {
  const limit = parseLimit(req.query.limit);
  const cursor = req.query.cursor || undefined;
  const userId = req.user.id;

  try {
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = follows.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return res.json({
        videos: [],
        nextCursor: null,
        hasNextPage: false,
        pagination: { nextCursor: null, hasNextPage: false },
      });
    }

    const take = limit + 1;
    const videos = await prisma.video.findMany({
      where: { userId: { in: followingIds } },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: videoInclude,
    });

    const hasNextPage = videos.length > limit;
    let items = hasNextPage ? videos.slice(0, limit) : videos;
    items = await attachLikedByMe(userId, items);

    res.json(cursorPageResponse(items, limit, hasNextPage));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load following feed" });
  }
}

export async function getUserVideos(req, res) {
  const { userId } = req.params;
  const viewerId = req.user?.id;
  try {
    let videos = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: videoInclude,
    });
    videos = await attachLikedByMe(viewerId, videos);
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load user videos" });
  }
}

export async function getVideoById(req, res) {
  const { videoId } = req.params;
  const viewerId = req.user?.id;
  try {
    const include = {
      user: { select: userSelect },
      _count: { select: { likes: true, comments: true } },
    };
    if (viewerId) {
      include.likes = { where: { userId: viewerId }, take: 1, select: { id: true } };
    }
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include,
    });
    if (!video) return res.status(404).json({ message: "Video not found" });
    const likedByMe = viewerId ? (video.likes?.length ?? 0) > 0 : false;
    const { likes, ...rest } = video;
    res.json({ ...rest, likedByMe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load video" });
  }
}

export async function createVideo(req, res) {
  try {
    const videoFile = req.files?.videoFile?.[0];
    if (!videoFile) {
      return res.status(400).json({ message: "videoFile is required" });
    }
    const { caption, description } = req.body;
    if (!caption || !String(caption).trim()) {
      return res.status(400).json({ message: "caption is required" });
    }
    let base = process.env.PUBLIC_BASE_URL || `http://127.0.0.1:${process.env.PORT || 5050}`;
    base = base.replace(/\/api\/?$/i, "").replace(/\/$/, "");
    const url = `${base}/uploads/videos/${videoFile.filename}`;
    let thumbnailUrl = null;
    const thumb = req.files?.thumbnail?.[0];
    if (thumb) {
      thumbnailUrl = `${base}/uploads/thumbnails/${thumb.filename}`;
    }
    const video = await prisma.video.create({
      data: {
        url,
        caption: String(caption).trim(),
        description: description ? String(description).trim() : null,
        thumbnailUrl,
        userId: req.user.id,
      },
      include: videoInclude,
    });
    const [withLiked] = await attachLikedByMe(req.user.id, [video]);
    res.status(201).json(withLiked);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Upload failed" });
  }
}

export async function deleteVideo(req, res) {
  try {
    const { videoId } = req.params;
    const existing = await prisma.video.findUnique({ where: { id: videoId } });
    if (!existing) return res.status(404).json({ message: "Video not found" });
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }
    await prisma.video.delete({ where: { id: videoId } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Delete failed" });
  }
}

export async function likeVideo(req, res) {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) return res.status(404).json({ message: "Video not found" });
    await prisma.like.upsert({
      where: { userId_videoId: { userId, videoId } },
      create: { userId, videoId },
      update: {},
    });
    const likeCount = await prisma.like.count({ where: { videoId } });
    res.json({ liked: true, likeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Like failed" });
  }
}

export async function unlikeVideo(req, res) {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    await prisma.like.deleteMany({ where: { userId, videoId } });
    const likeCount = await prisma.like.count({ where: { videoId } });
    res.json({ liked: false, likeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Unlike failed" });
  }
}

export async function getVideoComments(req, res) {
  try {
    const { videoId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { videoId },
      orderBy: { createdAt: "asc" },
      include: { user: { select: userSelect } },
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load comments" });
  }
}

export async function addVideoComment(req, res) {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ message: "content is required" });
    }
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) return res.status(404).json({ message: "Video not found" });
    const comment = await prisma.comment.create({
      data: {
        content: String(content).trim(),
        userId,
        videoId,
      },
      include: { user: { select: userSelect } },
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Comment failed" });
  }
}
