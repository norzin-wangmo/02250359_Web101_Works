"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { uploadVideo } from "@/services/videoService";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

export default function Upload() {
  const [formData, setFormData] = useState({
    caption: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-2">Please login to upload videos</p>
      </div>
    );
  }

  const handleVideoChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
  };

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setThumbnail(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    if (!formData.caption.trim()) {
      toast.error("Please enter a caption");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("videoFile", file);
      data.append("caption", formData.caption);
      if (formData.description) {
        data.append("description", formData.description);
      }
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      await uploadVideo(data);
      toast.success("Video uploaded successfully!");
      setFormData({ caption: "", description: "" });
      setFile(null);
      setThumbnail(null);
      setPreview(null);
      router.push("/");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Upload failed";
      toast.error(message);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        {preview && (
          <div className="mb-6">
            <p className="text-sm font-semibold mb-2">Video Preview:</p>
            <video
              src={preview}
              controls
              className="w-full rounded-lg max-h-80 object-cover"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Video File *</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Supported formats: MP4, WebM, Ogg</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Caption *</label>
          <input
            type="text"
            placeholder="Add a caption..."
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            className="w-full border rounded px-3 py-2"
            maxLength="150"
            required
          />
          <p className="text-xs text-gray-500 mt-1">{formData.caption.length}/150</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            placeholder="Add a description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border rounded px-3 py-2 h-24"
            maxLength="500"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Thumbnail (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}
