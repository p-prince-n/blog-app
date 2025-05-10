import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "./CallToAction";
import CommentSection from "./CommentSection";
import PostCard from "./PostCard";

const PostPage = () => {
  const { Id } = useParams();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [post, setPost] = useState(null);
  const [recentPost, setRecentPost]=useState(null);
  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://blog-app-i7rj.onrender.com/api/post/getPosts?postId=${Id}`, {credentials: 'include'});
        const data = await res.json();
        if (res.ok) {
          setPost(data.posts[0]);
          setErr(false);
        } else {
          setErr(true);
          console.log(data.message);
        }
        setLoading(false);
      } catch (e) {
        setErr(true);
        setLoading(false);
      }
    };
    getPost();
  }, [Id]);

  useEffect(()=>{
    const getRecentPost= async()=>{
      try{
        const res= await fetch('https://blog-app-i7rj.onrender.com/api/post/getPosts/?limit=3', {credentials: 'include'});
        const data= await res.json();
        if(res.ok){
          setRecentPost(data.posts);

        }else{
          console.log(data.message);
        }

      }catch(e){
        console.log(e.message);
        
      }
    }
    getRecentPost();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
    </div>;
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen ">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
        <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
            <Button color={'gray'} pill size="xs" className="">{post && post.category}</Button>
        </Link>
        <img src={post && post.image} alt={post && post.title} className=" self-center mt-10 p-3 max-h-[600px] w-full max-w-4xl object-cover " />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
        </div>
        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html: post && post.content}}>

        </div>
        <div className="max-w-4xl mx-auto w-full ">
          <CallToAction/>
           
        </div>

          <CommentSection postId={post && post._id} />
          <div className="flex flex-col justify-center items-center mb-5 ">
            <h1 className="text-xl mt-5 ">Recent Articles</h1>
            <div className="flex flex-wrap gap-5 mt-5 justify-center">
            {
              recentPost && (
                recentPost.map((post)=><PostCard key={post._id} post={post} />)
              )
            }
            </div>
          </div>

    </main>
  );
};

export default PostPage;
