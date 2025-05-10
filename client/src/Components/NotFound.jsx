import React from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 h-157">
      <h1 className="text-3xl lg:text-6xl text-red-600 font-semibold bounce-damp">404! Page Not Found</h1>
      <Link to={"/"}>
        <Button
          className="text-2xl p-6 bg-transparent dark:bg-transparent text-black dark:text-white border-3 border-blue-500  
                   hover:bg-gradient-to-r hover:from-pink-600 hover:to-blue-500  hover:text-white hover:border-0
                   active:bg-gradient-to-r active:from-pink-700 active:to-blue-600 active:text-white active:border-0
                   transition-all duration-300 ease-in-out 
                   focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 mt-10"
        >
          Go To Home Page
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
