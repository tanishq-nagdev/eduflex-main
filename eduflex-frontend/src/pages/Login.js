import React from "react";
import logo from "../assets/logo (2).png"; // Make sure logo.png exists in src/assets

export default function Login() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side: Logo */}
      <div className="flex-1 bg-green-600 flex items-center justify-center">
        <img
          src={logo}
          alt="EduFlex Logo"
          className="w-90 md:w-90 lg:w-116 h-auto transform transition duration-500 hover:scale-110 hover:rotate-3"
        />
      </div>

      {/* Right side: Login form */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-80 p-8 shadow-lg rounded-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Login to EduFlex
          </h2>

          <form>
            {/* Username input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder=" "
                className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <label className="absolute left-2 top-2 text-gray-500 text-sm
                                 peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                                 peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-green-600 transition-all">
                Username
              </label>
            </div>

            {/* Password input */}
            <div className="relative mb-6">
              <input
                type="password"
                placeholder=" "
                className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <label className="absolute left-2 top-2 text-gray-500 text-sm
                                 peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                                 peer-focus:top-[-8px] peer-focus:text-sm peer-focus:text-green-600 transition-all">
                Password
              </label>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span className="text-gray-700 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-green-600 text-sm hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 hover:scale-105 hover:shadow-lg transition transform duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
