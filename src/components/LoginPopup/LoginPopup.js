import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css";
import ResetPasswordPopup from "./ResetPasswordPopup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const LoginPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email and password are required.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/User/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
    

      if (data.success) {
        const user = data.data;

        if (!user) {
    
          setMessage("Login failed: No user data received.");
          setMessageType("error");
          return;
        }

        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("userUpdated"));

    
        setMessage("Login successful!");
        setMessageType("success");

       setTimeout(() => {
  navigate(-1); // 👈 go back to previous page
}, 1500);
      } else {
        setMessage(data.message || "Invalid email or password.");
        setMessageType("error");
      }
    } catch (error) {
    
      setMessage("Something went wrong. Please try again later.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
    navigate(-1);
  };

  return (
    <div className="login-popup-overlay" onClick={handleClose}>
      <Helmet>
  <title>Login | Kitchenary Kart</title>
  <meta
    name="description"
    content="Login to your Kitchenary Kart account to manage your orders, track deliveries, and enjoy exclusive offers."
  />
  <link rel="canonical" href="https://www.kitchenarykart.com/login" />
  <meta name="robots" content="noindex, follow" />
</Helmet>
      <div className="login-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        {!showResetPopup ? (
          <>
            <h3>Login</h3>
            {message && <p className={`message ${messageType}`}>{message}</p>}

            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div style={{ position: "relative", marginTop: "10px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    paddingRight: "40px",
                    width: "100%",
                    marginTop: "0",
                  }}
                />

                {/* Eye Icon to Toggle Password Visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#999",
                    width: "auto",
                    padding: "0",
                    margin: "0",
                  }}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              <button onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <p
              className="forgot-password-link"
              onClick={() => setShowResetPopup(true)} // Show the reset password form
            >
              Forgot Password?
            </p>

            <p className="signup-link">
              Don't have an account? <a href="/user-registration">Sign up</a>
            </p>
          </>
        ) : (
          <ResetPasswordPopup onClose={() => setShowResetPopup(false)} />
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
