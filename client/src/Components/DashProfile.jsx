import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Progress,
  Spinner,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { updateStart, updateSucces, updateFail, deleteUserStart, deleteUserSucces, deleteUserFail, signOutSuccess } from "../store/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {Link} from 'react-router-dom'

function DashProfile() {
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerref = useRef();
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [updateUser, setUpdateUser] = useState({});
  const [imageFileUpload, setImageFileUpload] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setUploadErr("File size should be less than 2MB");
      setUploadProgress(null);
      return;
    } else {
      setUploadErr("");
    }

    setImageFile(file);
    setImageFileUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUpload(true);
    setUploadErr(null);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "qwertus"); 

    setUploading(true);
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/du62uw7ti/image/upload");

  
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        setImageFileUrl(res.secure_url);
        setUpdateUser({ ...updateUser, profilePic: res.secure_url });
      } else {
        console.error("Upload failed:", xhr.responseText);
        setUploadErr("Image upload failed");
      }
      setImageFileUpload(false);
    };

    xhr.onerror = () => {
      setUploading(false);
      setUploadErr("An error occurred during the upload.");
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUpload(false);
    };

    xhr.send(formData);
  };
  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    e.preventDefault();
    if (Object.keys(updateUser).length === 0) {
      setUpdateUserError("No Changes made");
      return;
    }
    if (imageFileUpload) {
      setUpdateUserError("Please Wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`https://blog-app-i7rj.onrender.com/api/user/update/${currentUser._id}`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUser),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFail(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSucces(data));
        setUpdateUserSuccess("Users Profile updated successfully");
      }
    } catch (e) {
      dispatch(updateFail(e.message));
      setUpdateUserError(e.message);
    }
  };

  const HandleDeleteUser = async () => {
    setShowModel(false);  
    try{
      dispatch(deleteUserStart());
      const res=await fetch(`https://blog-app-i7rj.onrender.com/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include'

      });
      const data=await res.json();
      if (!res.ok) {
        dispatch(deleteUserFail(data.message));
      } else {
        dispatch(deleteUserSucces(data));
      }

    }catch(e){
      dispatch(deleteUserFail(e.message))
    }
  };
  const HandleSignOut=async()=>{
    try{
      const res=await fetch('https://blog-app-i7rj.onrender.com/api/user/signOut', {
        method:'POST',
        credentials: 'include'
      });
      const data=await res.json();
      if(!res.ok){
        console.log(data.message)
      }else{
        dispatch(signOutSuccess());
      }

    }catch(e){
      console.log(e.message)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          ref={filePickerref}
          hidden
          disabled={uploading}
        />
        <div
          className="size-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative"
          onClick={() => filePickerref.current.click()}
        >
          {uploadProgress && (
            <CircularProgressbar
              value={uploadProgress || 0}
              text={`${uploadProgress}`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0",
                  left: "0",
                },
                path: {
                  stroke: `rgba(62, 152, 199,${uploadProgress / 100} )  `,
                },
              }}
            />
          )}

          <img
            src={imageFileUrl || currentUser.profilePic}
            alt="profile Pic"
            className={`rounded-full size-full object-cover border-4 border-[lightgray] ${
              uploadProgress && uploadProgress < 100 && "opacity-60"
            }`}
          />
        </div>

        {uploading && (
          <Progress progress={uploadProgress} color="blue" size="sm" />
        )}
        {uploadErr && <Alert color="failure">{uploadErr}</Alert>}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          className=" bg-transparent dark:bg-transparent text-black dark:text-white border-3 border-blue-500  
             hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500  hover:text-white hover:border-0
             active:bg-gradient-to-r active:from-purple-700 active:to-blue-600 active:text-white active:border-0
             transition-all duration-300 ease-in-out 
             focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800" disabled={loading || imageFileUpload}
        >
          {loading || imageFileUpload ? <Spinner color="gray" size="md" /> : 'Update'}
        </Button>
        {
          currentUser.isAdmin && (
          <Link to='/create-post'>
          <Button className="bg-gradient-to-br from-green-400 to-blue-600 text-white hover:bg-gradient-to-bl focus:ring-green-200 dark:focus:ring-green-800 w-full">
            Add Post
          </Button>

          </Link>
          )
        }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={(e) => setShowModel(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={HandleSignOut}>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="size-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-l text-red-500 font-bold  dark:text-gray-400">
              Are your sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800 " onClick={HandleDeleteUser}>
                Yes, I'm Sure.
              </Button>
              <Button
                className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-white hover:bg-gradient-to-br focus:ring-cyan-300 dark:focus:ring-cyan-800 "
                onClick={() => setShowModel(false)}
              >
                No, Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default DashProfile;
