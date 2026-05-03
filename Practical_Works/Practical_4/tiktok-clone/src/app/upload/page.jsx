"use client";

import { useState } from "react";
import { uploadVideo } from "../../services/videoService";

export default function Upload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("video", file);

    await uploadVideo(formData);
    alert("Uploaded!");
  };

  return (
    <div>
      <h1>Upload Video</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}