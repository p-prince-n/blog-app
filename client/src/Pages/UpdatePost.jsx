import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const {currentUser}=useSelector((state)=>state.user);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [sendData, setSendData] = useState({
    title: "",
    category: "uncategorized",
    content: "",
    image: "",
  });

  const [imageFileUpload, setImageFileUpload] = useState(false);
  const [loadPost, setLoadPost] = useState(false);
  const [postError, setPostError] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`https://blog-app-i7rj.onrender.com/api/post/getPosts/?postId=${postId}`, {credentials: 'include'});
        const text = await res.text();

        try {
          const data = JSON.parse(text);
          if (!res.ok) {
            setPostError(data.message);
            return;
          }

          if (res.ok && data.posts[0]) {
            setSendData({
              title: data.posts[0].title || "",
              category: data.posts[0].category || "uncategorized",
              content: data.posts[0].content || "",
              image: data.posts[0].image || "",
            });
          }
        } catch (err) {
          console.error("Invalid JSON response:", text);
          setPostError("Failed to load post data.");
        }
      } catch (e) {
        console.error(e.message);
        setPostError("Something went wrong fetching the post.");
      } finally {
        setLoading(false); 
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleUploadPost = async () => {
    setImageFileUpload(true);
    setImageUploadError(null);
    if (!file) {
      setImageUploadError("Please select an image first.");
      setImageFileUpload(false);
      return;
    }

    setImageUploadProgress(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "qwertus");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/du62uw7ti/image/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setImageUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        setImageUrl(res.secure_url);
        setSendData({ ...sendData, image: res.secure_url });
      } else {
        console.error("Upload failed:", xhr.responseText);
        setImageUploadError("Image upload failed");
      }
      setImageFileUpload(false);
    };

    xhr.onerror = () => {
      setImageUploadError("An error occurred during the upload.");
      setFile(null);
      setImageFileUpload(false);
      setImageUploadProgress(null);
    };

    xhr.send(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPostError(null);
    setLoadPost(true);
    try {
      const res = await fetch(`https://blog-app-i7rj.onrender.com/api/post/updatePost/${postId}/${currentUser._id}`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });

      const data = await res.json();
      if (!res.ok) {
        setPostError(data.message || "Failed to publish post.");
      } else {
        navigate(`/posts/${data.slug}`);
      }
    } catch (e) {
      setPostError(e.message);
    } finally {
      setLoadPost(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgressbar className="w-24 h-24" />
      </div>
    );
    
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            required
            value={sendData.title}
            className="flex-1"
            onChange={(e) => setSendData({ ...sendData, title: e.target.value })}
          />
          <Select
            value={sendData.category || "uncategorized"}
            onChange={(e) => setSendData({ ...sendData, category: e.target.value })}
          >
            <option value="uncategorized">Uncategorized</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="Reactjs">Reactjs</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
                      className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800 h-15"
                      type="button"
                      size="md"
                      disabled={imageFileUpload}
                      onClick={handleUploadPost}
                    >
                      {imageFileUpload ? (
                        <div className="size-8">
                          <CircularProgressbar
                            value={imageUploadProgress}
                            text={`${imageUploadProgress || "0"}%`}
                          />
                        </div>
                      ) : (
                        "Upload image"
                      )}
                    </Button>
        </div>
        {imageUploadError && !file && <Alert color="failure">{imageUploadError}</Alert>}
        {sendData.image ? (
          <img src={sendData.image} className="w-full h-72 object-cover" alt="Post" />
        ) : (
          <p className="text-gray-500 text-sm">No image uploaded</p>
        )}

        <ReactQuill
          value={sendData.content || ""}
          theme="snow"
          className="mb-12"
          required
          onChange={(value) => setSendData((prev) => ({ ...prev, content: value }))}
        />

        <Button
                  className="bg-gradient-to-br from-pink-500 to-orange-400 text-white hover:bg-gradient-to-bl focus:ring-pink-200 dark:focus:ring-pink-800"
                  disabled={imageFileUpload || loadPost}
                  type="submit"
                >
          Update Post
        </Button>
        {postError && (
          <Alert className="mt-5" color="failure">
            {postError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdatePost;
