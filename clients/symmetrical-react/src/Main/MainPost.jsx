import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const MainPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
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

    const handleSubmit = async () => {
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
        <Container>
            <Form>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formContent">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formImages">
                    <Form.Label>Upload Images</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Form.Group>

                <Button variant="light" onClick={handleSubmit} style={{ margin: '1rem' }}>
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default MainPost;