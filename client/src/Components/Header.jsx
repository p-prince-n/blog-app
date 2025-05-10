import React, { useEffect, useState } from "react";
import {
  Button,
  Navbar,
  TextInput,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Dropdown,
  Avatar,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/theme/themeSlice.js";
import { signOutSuccess } from "../store/user/userSlice.js";
import { RxCross1 } from "react-icons/rx";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchbtn, setSearchbtn] = useState(false);

  const path = useLocation().pathname;
  const handleSearchbtn = () => {
    setSearchbtn(!searchbtn);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  const HandleSignOut = async () => {
    try {
      const res = await fetch("https://blog-app-i7rj.onrender.com/api/user/signOut", {
        method: "POST",
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  if (searchbtn) {
    return (
      <Navbar className="border-b-2 flex justify-between flex-wrap lg:hidden">
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="search..."
            rightIcon={AiOutlineSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="flex gap-3">
          <Button
            onClick={handleSearchbtn}
            className="w-10 h-10 lg:hidden p-0"
            color="gray"
            pill
          >
            <AiOutlineSearch className="text-white" />
          </Button>
          {searchbtn && (
            <Button
              onClick={handleSearchbtn}
              className="w-10 h-10 lg:hidden p-0"
              color="gray"
              pill
            >
              <RxCross1 />
            </Button>
          )}
        </div>
      </Navbar>
    );
  }
  return (
    <Navbar className="border-b-2  ">
      <Link
        to={"/"}
        className={`  self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white`}
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
        CodeCraft's
        </span>
        Blog
      </Link>
      <form className={!searchbtn ? "block" : "hidden"} onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <Button
            onClick={handleSearchbtn}
            className="w-10 h-10 lg:hidden p-0 border-0"
            color="gray"
            pill
          >
            <AiOutlineSearch className="text-white" />
          </Button>
          
            <Button
            className="w-10 h-10  p-0 border-0"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </Button>
          
      <div className="flex gap-2 md:order-2">
        
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.profilePic} rounded />}
          >
            <DropdownHeader>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </DropdownHeader>
            <Link to={"/dashboard?tab=profile"}>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={HandleSignOut}>Sign Out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button
              className=" bg-transparent dark:bg-transparent text-black dark:text-white border-3 border-blue-500  
             hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500  hover:text-white hover:border-0
             active:bg-gradient-to-r active:from-purple-700 active:to-blue-600 active:text-white active:border-0
             transition-all duration-300 ease-in-out 
             focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Sign In
            </Button>
          </Link>
        )}

        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <NavbarLink as={Link} to="/" active={path === "/"}>
          Home
        </NavbarLink>
        <NavbarLink as={Link} to="/about" active={path === "/about"}>
          About
        </NavbarLink>
        <NavbarLink as={Link} to="/projects" active={path === "/projects"}>
          Projects
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
};

export default Header;
