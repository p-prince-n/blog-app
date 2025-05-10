import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [sendData, setSendData] = useState({});
  const [imageFileUpload, setImageFileUpload] = useState(false);
  const [loadPost, setLoadPost] = useState(file);
  const [postError, setPostError] = useState(null);

  const navigate = useNavigate();

  const handleUploadPost = async (e) => {
    setImageFileUpload(true);
    setImageUploadError(null);
    if (!file) {
      setImageUploadError("Please Select Image first.");
      setImageFileUpload(false);
      return;
    }
    setImageUploadProgress(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "qwertus");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/du62uw7ti/image/upload");

    // Track upload progress
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
      const res = await fetch("https://blog-app-i7rj.onrender.com/api/post/create", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPostError(data.message);
      } else {
        console.log(data)
        navigate(`/post/${data.slug}`);
        setPostError(null);
      }
    } catch (e) {
      setPostError(e.message);
    } finally {
      setLoadPost(false);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            required
            className="flex-1"
            onChange={(e) =>
              setSendData({ ...sendData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setSendData({ ...sendData, category: e.target.value })
            }
          >
            <option value={"uncategorized"}>Select a category</option>
            <option value={"JavaScript"}>JavaScript</option>
            <option value={"Java"}>Java</option>
            <option value={"Python"}>Python</option>
            <option value={"Reactjs"}>Reactjs</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            typeof="file"
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
        {imageUploadError && !file ? (
          <Alert color="failure">{imageUploadError}</Alert>
        ) : (
          <></>
        )}
        {sendData.image && (
          <img src={sendData.image} className="w-full h-72 object-cover" />
        )}
        <ReactQuill
          theme="snow"
          className={`${sendData.image ? "h-63" : "h-135"} mb-12`}
          required
          onChange={(value) => setSendData({ ...sendData, content: value })}
        />
        <Button
          className="bg-gradient-to-br from-pink-500 to-orange-400 text-white hover:bg-gradient-to-bl focus:ring-pink-200 dark:focus:ring-pink-800"
          disabled={imageFileUpload || loadPost}
          type="submit"
        >
          Publish
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

export default CreatePost;
