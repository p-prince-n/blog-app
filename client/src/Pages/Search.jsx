import { Button, Select, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../Components/PostCard";

const Search = () => {
  const location = useLocation();
  const navigate=useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    order: "desc",
    category: "All",
  });
  console.log(sidebarData);
  

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        order: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchData=async()=>{
        const searchQuery=urlParams.toString();
        setLoading(true)
        try{
            const res= await fetch(`https://blog-app-i7rj.onrender.com/api/post/getPosts?${searchQuery}`, {credentials: 'include'});
            const data=await res.json();
            if(res.ok){
                console.log(data);  
                setPosts(data.posts);
                if(data.posts.length > 9){
                    setShowMore(true);
                }
            }else{
                console.log(data.message);
            }
        }catch(e){
            console.log(e.message);
        }finally{
            setLoading(false)
        }
    }
    fetchData();
  }, [location.search]);



  const handleChange=(e)=>{
    const data=e.target.value;
    switch(e.target.id){
        case 'searchTerm' :
            setSidebarData({...sidebarData, searchTerm : data });
            break;
        case 'sort' :
            const order= data || 'desc';
            setSidebarData({...sidebarData, order });
            break;
        case 'category':
            const category= data || 'uncategorized';
            setSidebarData({...sidebarData, category});
    }

  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    const urlParams=new URLSearchParams(location.search);
    if(sidebarData.searchTerm===null){
        urlParams.set('seacrhTerm', '');
    }else{
        urlParams.set('seacrhTerm', sidebarData.searchTerm);
    }
    if(sidebarData.order===null){
        urlParams.set('order', '');
    }else{

        urlParams.set('order', sidebarData.order);
    }
    if(sidebarData.category==='All'){
        urlParams.set('category', '')
    }else{
        

        urlParams.set('category', sidebarData.category)
    }
    const urlQuery=urlParams.toString();
    navigate(`/search?${urlQuery}`)
  }

  const handleShowMore=async()=>{
    const noOfPosts=posts.length;
    const startindex=noOfPosts;
    const urlParams= new URLSearchParams(location.search);
    urlParams.set('limit', startindex);
    const searchQuery=urlParams.toString();
    setLoading(true);
    try{
        const res= await fetch(`https://blog-app-i7rj.onrender.com/api/post/getPosts?${searchQuery}`, {credentials: 'include'});
        const data=await res.json();
        if(res.ok){
            console.log(data);  
            setPosts([...posts, data.posts]);
            if(data.posts.length > 9){
                setShowMore(true);
            }
        }else{
            console.log(data.message);
        }


    }catch(e){
            console.log(e.message);
        }finally{
            setLoading(false)
        }

  }
  


  return (
    <div className="flex flex-col md:flex-row ">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit} >
          <div className="flex items-center gap-2">
          <label className="whitespace-nowrap font-semibold">Search Term:</label>
          <TextInput placeholder="search" id="searchTerm" type="text" value={sidebarData.searchTerm} onChange={handleChange} />
          </div>
          <div className="flex items-center gap-2">
          <label className="font-semibold">Sort:</label>
          <Select onChange={handleChange} value={sidebarData.order} id="sort" className="w-25" >
            <option value={'dsc'}>Latest</option>
            <option value={'asc'}>Oldest</option>
          </Select>
          </div>
          <div className="flex items-center gap-2">
          <label className="font-semibold">Category:</label>
          <Select onChange={handleChange} value={sidebarData.category===null ? '': sidebarData.category} id="category" className="w-40" >
          <option value="All">All</option>
            <option value="uncategorized">uncategorized</option>
            <option value={'reactjs'}>React.js</option>
            <option value={'nextjs'}>Next.js</option>
            <option value={'JavaScript'}>JavaScript</option>
            <option value={'Java'}>Java</option>
            <option value={'Python'}>Python</option>
          </Select>
          </div>
          <Button type="submit" className="bg-transparent dark:bg-transparent text-black dark:text-white border-3 border-pink-900  
             hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500  hover:text-white hover:border-0    
             active:bg-gradient-to-r active:from-purple-700 active:to-pink-600 active:text-white active:border-0
             transition-all duration-300 ease-in-out 
             focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800" >Apply Filter</Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-se sm:border-b border-gray-500 p-3 mt-5  ">Post result</h1>
        {loading && <div className="flex m-auto justify-center items-center min-h-screen"> <Spinner  /></div>}
        <div className="p-7 flex flex-wrap gap-4 ">
            {
                !loading && posts.length ===0 && <p className="text-xl text-gray-500">No posts found</p>
            }
            {!loading && posts && posts.length > 0 && (<div className="flex flex-wrap justify-center gap-4 sm:gap-10 w-full">{posts.map((post)=>(
                <PostCard post={post} key={post._id} />))}</div>)}
                {!loading && showMore && <button onClick={handleShowMore}  className="text-teal-500 text-lg hover:underline p-7 w-full"></button>}
            
            
        </div>

      </div>
    </div>
  );
};

export default Search;
