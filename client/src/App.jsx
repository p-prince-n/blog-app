import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./Pages/Home";
import { About } from "./Pages/About";
import { SignIn } from "./Pages/SignIn";
import { SignUp } from "./Pages/SignUp";
import { Dashboard } from "./Pages/Dashboard";
import { Projects } from "./Pages/Projects";
import Header from "./Components/Header";
import FooterCom from "./Components/Footer";
import PrivateRouter from "./Components/PrivateRouter";
import OnlyAdminPrivateRouter from "./Components/OnlyAdminPrivateRouter";
import CreatePost from "./Pages/CreatePost";
import UpdatePost from "./Pages/UpdatePost";
import PostPage from "./Components/PostPage";
import ScrollToTop from "./Components/ScrollToTop";
import NotFound from "./Components/NotFound";
import { useSelector } from "react-redux";
import Search from "./Pages/Search";



function App() {
  const {currentUser}=useSelector((state)=>state.user);
  return (
    <>
    <ScrollToTop/>
      <Header />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={!currentUser ? <SignIn /> : <Navigate to={'/'} />} />
        <Route path="/sign-up" element={!currentUser ? <SignUp /> : <Navigate to={'/'} /> } />
        <Route element={<PrivateRouter />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRouter />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/post/:Id" element={<PostPage/>} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FooterCom />
    </>
  );
}

export default App;
