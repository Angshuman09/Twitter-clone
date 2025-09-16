import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/XSvg";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isError, isPending} = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

		const data =await res.json();
		if(!res.ok) throw new Error(data.error || "Failed to create account");
		console.log(data);
		return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

	onSuccess: ()=>{
		toast.success("account created successfully");

		queryClient.invalidateQueries({queryKey:["authUser"]});
	}
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
	  mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-screen-xl mx-auto flex h-screen px-10 bg-black">
        <div className="flex-1 hidden lg:flex items-center justify-center">
          <XSvg className="lg:w-2/3 fill-white" />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <form
            className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
            onSubmit={handleSubmit}
          >
            <XSvg className="w-24 lg:hidden fill-white" />
            <h1 className="text-4xl font-extrabold text-white mb-4">
              Join today.
            </h1>

            {/* Email Input */}
            <label className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <MdOutlineMail size={20} />
              </div>
              <input
                type="email"
                className="w-full bg-black border border-gray-800 rounded-md px-12 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
              />
            </label>

            {/* Username and Full Name Row */}
            <div className="flex gap-4 flex-wrap">
              <label className="relative flex-1 min-w-[200px]">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaUser size={18} />
                </div>
                <input
                  type="text"
                  className="w-full bg-black border border-gray-800 rounded-md px-12 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                />
              </label>
              <label className="relative flex-1 min-w-[200px]">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <MdDriveFileRenameOutline size={20} />
                </div>
                <input
                  type="text"
                  className="w-full bg-black border border-gray-800 rounded-md px-12 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Full Name"
                  name="fullName"
                  onChange={handleInputChange}
                  value={formData.fullName}
                />
              </label>
            </div>

            {/* Password Input */}
            <label className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <MdPassword size={20} />
              </div>
              <input
                type="password"
                className="w-full bg-black border border-gray-800 rounded-md px-12 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
              />
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors mt-6"
            >
              {isPending ? "Loading" : "Sign up"}
            </button>

            {isError && (
              <p className="text-red-500 text-center">Something went wrong</p>
            )}
          </form>

          {/* Sign In Link */}
          <div className="flex flex-col lg:w-2/3 gap-2 mt-8">
            <p className="text-white text-lg">Already have an account?</p>
            <Link to="/login">
              <button className="w-full bg-transparent border border-gray-600 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-900 transition-colors">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
