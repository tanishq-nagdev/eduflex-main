import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, MOCK_USERS } from "../contexts/AppContext";
import { toast } from 'react-toastify';
import logo from "../assets/logo (2).png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { loginUser } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find a user (student OR professor)
    const user = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      loginUser(user);
      toast.success(`Welcome back, ${user.name}!`);

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', email);
      } else {
        localStorage.removeItem('rememberMe');
      }

      // Redirect by role
      setTimeout(() => {
        if (user.role === "professor") {
          navigate('/professor/dashboard');
        } else {
          navigate('/courses'); // or '/courses' as you prefer for student
        }
      }, 500);
    } else {
      toast.error('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  // Load remembered email on mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberMe');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f0f0" }}>
      {/* Left side: Logo */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #10b981, #059669)",
        }}
        className="hidden md:flex"
      >
        <img
          src={logo}
          alt="EduFlex Logo"
          className="w-90 md:w-90 lg:w-116 h-auto transform transition duration-500 hover:scale-110 hover:rotate-3"
        />
      </div>

      {/* Right side: Login form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <form 
          onSubmit={handleSubmit}
          style={{ 
            width: "100%",
            maxWidth: "400px",
            background: "white",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}
        >
          <h2 style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            textAlign: "center",
            color: "#059669"
          }}>
            Login
          </h2>
          <p style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "1.5rem",
            fontSize: "0.9rem"
          }}>
            Welcome! Please login to continue.
          </p>
          {/* Email input */}
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
              disabled={loading}
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{
                background: loading ? "#f3f4f6" : "white"
              }}
            />
            <label
              style={{
                position: "absolute",
                left: "0.5rem",
                top: "0.5rem",
                color: "#888",
                transition: "all 0.3s",
                pointerEvents: "none",
              }}
              className="peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-green-600 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Email Address
            </label>
          </div>
          {/* Password input */}
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              disabled={loading}
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{
                background: loading ? "#f3f4f6" : "white"
              }}
            />
            <label
              style={{
                position: "absolute",
                left: "0.5rem",
                top: "0.5rem",
                color: "#888",
                transition: "all 0.3s",
                pointerEvents: "none",
              }}
              className="peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-green-600 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280",
                fontSize: "0.875rem",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Remember me & Forgot password */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem"
          }}>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                style={{ marginRight: "0.5rem" }} 
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => toast.info('Password reset feature coming soon!')}
              style={{ 
                color: "#059669",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => !loading && (e.target.style.transform = "scale(1)")}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ 
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid white",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginRight: "0.5rem"
                }}></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

          {/* Demo credentials info */}
          <div style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            color: "#059669"
          }}>
            <strong>📌 Demo Student:</strong>
            <div style={{ marginTop: "0.5rem", fontFamily: "monospace" }}>
              <div>📧 student@eduflex.com<br/>🔒 student123</div>
            </div>
            <strong>📌 Demo Professor:</strong>
            <div style={{ marginTop: "0.5rem", fontFamily: "monospace" }}>
              <div>📧 prof.sharma@eduflex.com<br/>🔒 prof123</div>
            </div>
          </div>
        </form>
      </div>

      {/* Add spinning animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
