// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { toast } from 'react-toastify';
import logo from "../assets/logo (2).png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { loginUser, user } = useApp();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'professor') navigate('/professor/dashboard', { replace: true });
      else if (user.role === 'student') navigate('/dashboard', { replace: true });
      else if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Call context loginUser (connects to backend)
    const loggedInUser = await loginUser(email, password);

    if (loggedInUser) {
      if (rememberMe) {
        localStorage.setItem('rememberMeEmail', email);
      } else {
        localStorage.removeItem('rememberMeEmail');
      }
      // Redirect is triggered by useEffect after user state updates
    } else {
      setLoading(false); // Only set loading on failure
    }
  };

  // Load remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberMeEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side: Logo */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-green-500 to-green-700">
        <img
          src={logo}
          alt="EduFlex Logo"
          className="w-3/4 max-w-md transform transition duration-500 hover:scale-110 hover:rotate-3"
        />
      </div>

      {/* Right side: Login form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-green-700">
            Login
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Welcome! Please login to continue.
          </p>
          {/* Email input */}
          <div className="relative mb-6">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
              disabled={loading}
              className="peer block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white disabled:bg-gray-100"
            />
            <label
              htmlFor="email"
              className="absolute left-3 -top-2.5 text-xs text-gray-500 bg-white px-1 transition-all duration-200
                         peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                         peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-600"
            >
              Email Address
            </label>
          </div>
          {/* Password input */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              disabled={loading}
              className="peer block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white disabled:bg-gray-100"
            />
            <label
              htmlFor="password"
              className="absolute left-3 -top-2.5 text-xs text-gray-500 bg-white px-1 transition-all duration-200
                         peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                         peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-600"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-green-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex justify-between items-center mb-6 text-sm">
            <label className="flex items-center cursor-pointer text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => toast.info('Password reset feature coming soon!')}
              className="text-green-600 hover:text-green-800 hover:underline focus:outline-none"
            >
              Forgot password?
            </button>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md font-semibold text-base
                       hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                       transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
