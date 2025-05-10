import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux';
import {Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal,ModalHeader,ModalBody, Button } from 'flowbite-react';

import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from 'react-icons/fa';


const DashUsers = () => {
  const {currentUser}=useSelector((state)=>state.user);
  const [users, setUsers]=useState([]);
  const [showMore, setShowMore]=useState(false);
  const [showModel, setShowModel]=useState(false);  
  const [userIdToDelete, setUserIdToDelete]=useState('');
  useEffect(()=>{
    const fetchUsers=async()=>{
      try{
        const res=await fetch(`https://blog-app-i7rj.onrender.com/api/user/getUsers`, {credentials: 'include'});
        const data=await res.json();
        if(res.ok){
          setUsers(data.users);
          if(data.users.length<9){
            setShowMore(false)
          }
        }

      }catch(e){
        console.log(e);
      }
      

    };
    if(currentUser.isAdmin){
      fetchUsers();
    }
  }, [currentUser._id])

  const handleShowMore=async()=>{
    const startIndex=users.length;
    try{
      const res=await fetch(`https://blog-app-i7rj.onrender.com/api/user/getUsers/?startIndex=${startIndex}`, {credentials: 'include'});
      const data=await res.json();
      if(res.ok){
        setUsers((prev)=>[...prev, ...data.users]);
        if(data.users.length<9){
          setShowMore(false)
        }

      }

    }catch(e){
      console.log(e);
    }

  }
  const HandleDeleteUser=async()=>{
    try{
      const res= await fetch(`https://blog-app-i7rj.onrender.com/api/user/delete/${userIdToDelete}`, {
        method:'DELETE',
        credentials: 'include'

      });
      const data= await res.json();
      if(res.ok){
        setUsers((prev)=> prev.filter((user)=> user._id !== userIdToDelete));
        setShowModel(false);
      }else{
        console.log(data.message)
      }

    } catch(e){
      console.log(e.message)
    }
  }

  return (
    <div className='px-10 py-5 w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
          <TableHead>
            <TableHeadCell>Date Updated</TableHeadCell>
            <TableHeadCell>User Image</TableHeadCell>
            <TableHeadCell>username</TableHeadCell>
            <TableHeadCell>email</TableHeadCell>
            <TableHeadCell>Admin</TableHeadCell>
            <TableHeadCell>Delete</TableHeadCell>
          </TableHead>
          {users.map((user)=>(
            <TableBody key={user._id} className='divide-y'>
              <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
         
                  <img src={user.profilePic} alt={user.username} className='w-10 h-10 rounded-full object-cover bg-gray-500' />
                
                </TableCell>
                <TableCell>
              
                    {user.username}

                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin? <FaCheck className='text-green-500 ' />: <FaTimes className='text-red-500 ' />}</TableCell>

                <TableCell>
                  <span onClick={()=>{setShowModel(true); setUserIdToDelete(user._id)}} className='font-medium text-red-500 hover:underline cursor-pointer'>
                    Delete
                  </span>
                </TableCell>
                
              </TableRow>
            </TableBody>
          ))}
        </Table>
        {showMore && <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show More</button>}
        </>
      ): (<p>You have no users yet!</p>)}
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
                    Are your sure you want to delete this user?
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
  )
}

export default DashUsers;