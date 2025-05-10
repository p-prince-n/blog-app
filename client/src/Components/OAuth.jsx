import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth';
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSucces } from "../store/user/userSlice.js";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
    const auth=getAuth(app);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleGoogleClick=async(e)=>{
        const provider= new GoogleAuthProvider();
        provider.setCustomParameters({prompt: 'select_account'});
        try{
            const resultFromGoogle=await signInWithPopup(auth, provider);
            const res=await fetch('https://blog-app-i7rj.onrender.com/api/auth/google', {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body : JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email:resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL, 
                }),
            });
            const data= await res.json();
            if(res.ok){
                dispatch(signInSucces(data));
                navigate('/')

            }

        }catch(e){

        }
    }
  return (
    <Button
      className="bg-transparent dark:bg-transparent dark:text-white text-black border-pink-500 border-2 to-pink-500 
                  hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-400  hover:border-0 hover:text-white
                  active:bg-gradient-to-l active:from-purple-500 active:to-pink-500 active:border-0 active:text-white
                  transition-all duration-300 ease-in-out 
                  focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
      type="button" onClick={handleGoogleClick} 
    >
      <AiFillGoogleCircle className="size-6 mr-2" />
      <span>Continue with Google</span>
    </Button>
  );
};

export default OAuth;
