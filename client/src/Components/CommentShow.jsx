import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

const CommentShow = ({ comnt, onLike, onEdit, onDelete }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isEdit, setIsEdit] = useState(false);
  const [editedContent, setEditedContent] = useState(comnt.content);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`https://blog-app-i7rj.onrender.com/api/user/${comnt.userId}`, {credentials: 'include'});
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.log(data.message);
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    getUsers();
  }, []);

  const handleEdit = () => {
    setIsEdit(true);
    setEditedContent(comnt.content);
  };
  const handleSave=async()=>{
    try{
        const res= await fetch(`https://blog-app-i7rj.onrender.com/api/comment/editComments/${comnt._id}`, {
            method : 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content : editedContent
            })
        });
        if(res.ok){
            setIsEdit(false);
            onEdit(comnt, editedContent)

        }

    }catch(e){
        console.log(e.message);
        
    }
  }

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="size-10 rounded-full bg-gray-200 "
          src={user && user.profilePic}
          alt={user && user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-sm truncate ">
            {user ? `@${user && user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(user && user.createdAt).fromNow()}
          </span>
        </div>
        {isEdit ? (
            <>
          <Textarea
            value={editedContent}
            className="mb-2"
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="flex justify-end gap-2 text-xs">
            <Button type="button" size="sm" onClick={handleSave} >
                Save
            </Button>
            <Button type="button" size="sm" onClick={()=>setIsEdit(false)}>
                Cancel
            </Button>
          </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comnt.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comnt._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comnt.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comnt.noOfLikes > 0 &&
                  comnt.noOfLikes +
                    " " +
                    (comnt.noOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comnt.userId || currentUser.isAdmin) && (
                    <>
                  <button
                    onClick={handleEdit}
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                  onClick={()=>onDelete(comnt._id)}
                  type="button"
                  className="text-gray-400 hover:text-red-500"
                >
                  Delete
                </button>
                </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentShow;
