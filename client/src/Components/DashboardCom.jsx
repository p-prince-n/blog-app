import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashboardCom = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthsUsers, setLastMonthsUsers] = useState(0);
  const [lastMonthsPosts, setLastMonthsPosts] = useState(0);
  const [lastMonthsComments, setLastMonthsComments] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://blog-app-i7rj.onrender.com/api/user/getUsers/?limit=5", {credentials: 'include'});
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthsUsers(data.lastMonthsUser);
        } else {
          console.log(data.message);
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch("https://blog-app-i7rj.onrender.com/api/comment/getComments/?limit=5", {credentials: 'include'});
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setLastMonthsComments(data.lastMonthsComments);
          setTotalComments(data.totalComments);
        } else {
          console.log(data.message);
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://blog-app-i7rj.onrender.com/api/post/getPosts/?limit=5", {credentials: 'include'});
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthsPosts(data.lastMonthsPost);
        } else {
          console.log(data.message);
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
      fetchPosts();
      fetchUsers();
    }
  }, []);
  return (
    <div className="p-3 md:mx-auto flex flex-col gap-3 ">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md ">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl ">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg " />
          </div>
          <div className="flex gap-2 text-sm ">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthsUsers}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md ">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl ">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg " />
          </div>
          <div className="flex gap-2 text-sm ">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthsComments}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md ">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl ">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg " />
          </div>
          <div className="flex gap-2 text-sm ">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthsPosts}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center ">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button
              className=" bg-transparent dark:bg-transparent text-black dark:text-white border-3 border-purple-500  
                             hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500  hover:text-white hover:border-0
                             active:bg-gradient-to-r active:from-purple-700 active:to-pink-600 active:text-white active:border-0
                             transition-all duration-300 ease-in-out 
                             focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <Link to={"/dashboard?tab=users"}> see all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>User image</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
            </TableHead>
            {users &&
              users.map((user) => (
                <TableBody key={user._id} className="divide-y">
                  <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell>
                      <img
                        src={user.profilePic}
                        alt="user"
                        className="size-10 rounded-full bg-gray-500"
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button
              className=" bg-transparent dark:bg-transparent text-black dark:text-white border-3 border-purple-500  
                             hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500  hover:text-white hover:border-0
                             active:bg-gradient-to-r active:from-purple-700 active:to-pink-600 active:text-white active:border-0
                             transition-all duration-300 ease-in-out 
                             focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <Link to={"/dashboard?tab=comments"}> see all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Comment content</TableHeadCell>
              <TableHeadCell>Likes</TableHeadCell>
            </TableHead>
            {comments &&
              comments.map((comment) => (
                <TableBody key={comment._id} className="divide-y">
                  <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </TableCell>
                    <TableCell>{comment.noOfLikes}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button
              className=" bg-transparent dark:bg-transparent text-black dark:text-white border-3 border-purple-500  
                             hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500  hover:text-white hover:border-0
                             active:bg-gradient-to-r active:from-purple-700 active:to-pink-600 active:text-white active:border-0
                             transition-all duration-300 ease-in-out 
                             focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <Link to={"/dashboard?tab=posts"}> see all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Post image</TableHeadCell>
              <TableHeadCell>Post title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
            </TableHead>
            {posts &&
              posts.map((post) => (
                <TableBody key={post._id} className="divide-y">
                  <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell>
                      <img
                        src={post.image}
                        alt="post"
                        className="w-14 h-10 rounded-md  bg-gray-500"
                      />
                    </TableCell>
                    <TableCell className="w-96">{post.title}</TableCell>
                    <TableCell className="w-5">{post.category}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardCom;
