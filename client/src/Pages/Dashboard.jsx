import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom'
import DashSideBar from '../Components/DashSideBar';
import DashProfile from '../Components/DashProfile';
import DashPosts from '../Components/DashPosts';
import DashUsers from '../Components/DashUsers';
import DashComments from '../Components/DashComments';
import DashboardCom from '../Components/DashboardCom';
export const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab]=useState('');
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab');
    
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <DashSideBar/>

      </div>
 
        {tab==='profile' && <DashProfile/>}
        {tab==='posts' && <DashPosts/>}
        {tab==='users' && <DashUsers/>}
        {tab=='comments' && <DashComments/>}
        {tab=='dash' && <DashboardCom/>}


    </div>
  )
}
