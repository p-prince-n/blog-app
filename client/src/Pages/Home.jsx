import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../Components/CallToAction'
import { Spinner } from 'flowbite-react';
import PostCard from '../Components/PostCard'

export const Home = () => {
  const [posts, setPosts]=useState([]);
  const [loading, setLoading]=useState(false);
  console.log(posts);
  
  useEffect(()=>{
    const fetchPost=async()=>{
      setLoading(true);
      try{
        const res= await fetch('https://blog-app-i7rj.onrender.com/api/post/getPosts', {credentials: 'include'});
        const data=await res.json();
        if(res.ok){
          setPosts(data.posts);
        }else{
          console.log(data.message)
        }
        

      }catch(e){
        console.log(e.message);
      }finally{
        setLoading(false);
      }
    }
    fetchPost();
  }, [])


  if(loading) return (
    <div className='flex justify-center items-center  h-screen'>
      <Spinner  />
    </div>
  )
  return (
    <div >
    <div className='flex flex-col gap-6 p-10 px-3 max-w-6xl mx-auto '>
      <h1 className='text-3xl  font-bold lg:text-6xl pt-10 '>Welcome to my Blog</h1>
      <p className='text-gray-500 text-xs sm:text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, ipsam. Neque laudantium sequi voluptas temporibus veritatis illo, quod provident distinctio. Nisi, natus sapiente aliquam aperiam facilis ab quisquam saepe recusandae quas quae expedita voluptatem et maiores libero alias sit! Maxime ipsum eaque laborum, culpa sed sit maiores ad nesciunt provident!</p>

    <Link to={'/search'} className='text-xs sm:text-sm text-teal-500 font-bold hover:underline '>View All</Link>
    </div>
    <div className='flex mx-auto mb-5 justify-center p-3 bg-amber-100 dark:bg-slate-700 max-w-4xl'>
      < CallToAction  />
    </div>
    <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-3'>
      {(posts && posts.length > 0) ? (
        <div className='flex flex-col gap-6'>
          <h2 className='text-2xl font-semibold text-center '>Recent Post</h2>
          <div className='flex flex-wrap justify-center gap-4 sm:gap-10 w-full'>
            {
              posts.map((post)=>(
                <PostCard post={post} key={post._id} />
              ))
            }
          </div>
          <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center ' >View All</Link>
        </div>
      ): (<h3>There is no Post Yet</h3>)}

    </div>
    </div>
  )
}
