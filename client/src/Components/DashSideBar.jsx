import React from "react";
import { Sidebar, SidebarItem, SidebarItemGroup } from "flowbite-react";
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../store/user/userSlice";
import { useSelector } from "react-redux";

const DashSideBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
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
  return (
    <Sidebar className="w-full md:w-56">
      <SidebarItemGroup className="flex flex-col gap-1">
      {currentUser.isAdmin && (
          <Link to={"/dashboard?tab=dash"}>
          <SidebarItem
          as={'div'}
            active={tab === "dash" || !tab}
            icon={HiChartPie}
            labelColor="dark"
          >
            Dashboard
          </SidebarItem>
          </Link>
        )}
        <Link to={"/dashboard?tab=profile"}>
        <SidebarItem
          as={'div'}
          active={tab === "profile"}
          icon={HiUser}
          label={currentUser.isAdmin ? "Admin" : "user"}
          labelColor="dark"
        >
          Profile
        </SidebarItem>
        </Link>

        

        {currentUser.isAdmin && (
          <Link to={"/dashboard?tab=posts"}>
          <SidebarItem
          as={'div'}
            active={tab === "posts"}
            icon={HiDocumentText}
            labelColor="dark"
          >
            Posts
          </SidebarItem>
          </Link>
        )}

{currentUser.isAdmin && (
          <Link to={"/dashboard?tab=comments"}>
          <SidebarItem
          as={'div'}
            active={tab === "comments"}
            icon={HiAnnotation}
            labelColor="dark"
          >
            Comments
          </SidebarItem>
          </Link>
        )}

        {currentUser.isAdmin && (
          <Link to={"/dashboard?tab=users"}>
          <SidebarItem
          as={'div'}
            active={tab === "users"}
            icon={HiOutlineUserGroup}
            labelColor="dark"
          >
            Users
          </SidebarItem>
          </Link>
        )}

        <SidebarItem
          icon={HiArrowSmRight}
          className="cursor-pointer"
          onClick={HandleSignOut}
        >
          Sign Out
        </SidebarItem>
      </SidebarItemGroup>
    </Sidebar>
  );
};

export default DashSideBar;
