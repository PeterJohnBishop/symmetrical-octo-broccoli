import React, { useState } from "react";
import axios from "axios";

const ImageUploadComponent = () => {
  const [files, setFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadMultipleImages = async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
  
      // Replace with your Firebase token
      const token = localStorage.getItem("firebaseToken");
  
      const response = await axios.post("http://localhost:8080/files/upload-multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data; // Contains publicUrls
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleUpload = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await uploadMultipleImages(files);
      setUploadedUrls(result.publicUrls);
    } catch (err) {
      setError("Failed to upload images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Upload Multiple Images</h5>
          <input
            type="file"
            className="form-control"
            multiple
            onChange={handleFileChange}
          />
          <button
            className="btn btn-primary mt-3"
            onClick={handleUpload}
            disabled={loading || files.length === 0}
          >
            {loading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {uploadedUrls.length > 0 && (
        <div className="mt-3">
          <h5>Uploaded Image URLs:</h5>
          <ul className="list-group">
            {uploadedUrls.map((url, index) => (
              <li className="list-group-item" key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploadComponent;