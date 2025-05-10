import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import OAuth from "../Components/OAuth";
export const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errMess, setErrMess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrMess("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrMess(null);
      const res = await fetch("https://blog-app-i7rj.onrender.com/api/auth/signUp", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrMess(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/sign-in');
      }
    } catch (e) {
      setErrMess(e.message);
      return setLoading(false);
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-20">
        {/*left side */}
        <div className="flex-1 ">
          <Link to={"/"} className="  font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              CodeCraft's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae,
            voluptas. Et quos illum unde error, possimus nulla. Quos voluptate
            quibusdam voluptates maxime ut. Quod doloremque officiis quo animi
            explicabo consequuntur eaque. Itaque nostrum ipsa fuga obcaecati
            illo. At, inventore doloribus.
          </p>
        </div>
        {/*right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4 " onSubmit={handleOnSubmit}>
            <div>
              <Label>Your username</Label>
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                onChange={handleOnChange}
              />
            </div>
            <div>
              <Label>Your email</Label>
              <TextInput
                type="email"
                placeholder="xyz@company.com"
                id="email"
                onChange={handleOnChange}
              />
            </div>
            <div>
              <Label>Your password</Label>
              <TextInput
                type="text"
                placeholder="password"
                id="password"
                onChange={handleOnChange}
              />
            </div>
            <Button
              className="bg-transparent dark:bg-transparent dark:text-white text-black border-pink-500 border-2 to-pink-500 
              hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500  hover:border-0 hover:text-white
              active:bg-gradient-to-r active:from-purple-500 active:to-pink-500 active:border-0 active:text-white
              transition-all duration-300 ease-in-out 
              focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />{" "}
                  <span className="pl-3">Loading....</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-3 text-sm mt-5">
            <span>Have an account?</span>
            <Link to={"/sign-in"} className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errMess && (
            <Alert className="mt-5 " color="failure">
              {errMess}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};
