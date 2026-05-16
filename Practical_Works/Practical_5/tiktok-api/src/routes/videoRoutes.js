import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { requireAuth, optionalAuth } from "../middleware/authMiddleware.js";
import {
  getAllVideos,
  getFollowingVideos,
  getUserVideos,
  getVideoById,
  createVideo,
  deleteVideo,
  likeVideo,
  unlikeVideo,
  getVideoComments,
  addVideoComment,
} from "../controllers/videoController.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "../..");
const videosDir = path.join(rootDir, "uploads/videos");
const thumbsDir = path.join(rootDir, "uploads/thumbnails");

[videosDir, thumbsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, file, cb) => {
      if (file.fieldname === "thumbnail") cb(null, thumbsDir);
      else cb(null, videosDir);
    },
    filename: (_req, file, cb) => {
      const ext =
        path.extname(file.originalname) || (file.fieldname === "thumbnail" ? ".jpg" : ".mp4");
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  }),
});

const router = Router();

router.get("/following", requireAuth, getFollowingVideos);
router.get("/user/:userId", optionalAuth, getUserVideos);
router.get("/", optionalAuth, getAllVideos);

router.get("/:videoId/comments", getVideoComments);
router.post("/:videoId/comments", requireAuth, addVideoComment);
router.post("/:videoId/like", requireAuth, likeVideo);
router.delete("/:videoId/like", requireAuth, unlikeVideo);

router.get("/:videoId", optionalAuth, getVideoById);

router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
);

router.delete("/:videoId", requireAuth, deleteVideo);

export default router;
