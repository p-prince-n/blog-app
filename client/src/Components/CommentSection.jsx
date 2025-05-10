import {
  Alert,
  Button,
  Textarea,
  TextInput,
  Modal,
  ModalHeader,
  ModalBody,
} from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CommentShow from "./CommentShow";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState("");
  const [commentErr, setCommentErr] = useState(null);
  const [commentApi, setCommentApi] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommentErr(null);
    if (comments.length > 200) {
      setCommentErr("you can post comment atmost 200 character!!!");
    }
    try {
      const res = await fetch(
        "https://blog-app-i7rj.onrender.com/api/comment/create",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: comments,
            postId,
            userId: currentUser._id,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCommentErr(null);
        setComments("");
        setCommentApi([data, ...commentApi]);
      } else {
        setCommentErr(data.message);
      }
    } catch (e) {
      setCommentErr(e.message);
    }
  };

  useState(() => {
    const getComments = async () => {
      try {
        const res = await fetch(
          `https://blog-app-i7rj.onrender.com/api/comment/getComments/${postId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setCommentApi(data);
        } else {
          console.log(data.message);
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(
        `https://blog-app-i7rj.onrender.com/api/comment/likeComments/${commentId}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setCommentApi(
          commentApi.map((comment) => {
            return comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  noOfLikes: data.likes.length,
                }
              : comment;
          })
        );
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const handleEdit = async (coment, editedComment) => {
    setCommentApi(
      commentApi.map((c) =>
        c._id === coment._id ? { ...c, content: editedComment } : c
      )
    );
  };
  const handleDelete = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(
        `https://blog-app-i7rj.onrender.com/api/comment/deleteComments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCommentApi(commentApi.filter((c) => c._id !== commentId));
      } else {
        console.log(data.message);
      }
      setShowModel(false);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sms">
          <p>Signed in as : </p>
          <img
            className="size-5 object-cover rounded-full ml-2"
            src={currentUser.profilePic}
            alt={currentUser.username}
          />
          <Link
            className="text-xs text-cyan-600 hover:underline"
            to={"/dasgboard/?tab=profile"}
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1 ">
          You must be signed in to comment.
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment...."
            rows={"3"}
            maxLength={"200"}
            onChange={(e) => setComments(e.target.value)}
            value={comments}
          />
          <div className="flex justify-between items-center mt-5 ">
            <p className="text-gray-500 text-xs">
              {200 - comments.length} characters left{" "}
            </p>
            <Button
              className=" bg-transparent dark:bg-transparent text-black dark:text-white border-3 border-blue-500  
                                 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500  hover:text-white hover:border-0
                                 active:bg-gradient-to-r active:from-purple-700 active:to-blue-600 active:text-white active:border-0
                                 transition-all duration-300 ease-in-out 
                                 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
              type="submit"
            >
              Submit
            </Button>
          </div>
          {commentErr && (
            <Alert color="failure" className="mt-5">
              {commentErr}
            </Alert>
          )}
        </form>
      )}

      {commentApi.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-2">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{commentApi.length}</p>
            </div>
          </div>
          {commentApi.map((comnt) => (
            <CommentShow
              key={comnt._id}
              comnt={comnt}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModel(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
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
              Are your sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800 "
                onClick={() => handleDelete(commentToDelete)}
              >
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

export default CommentSection;
