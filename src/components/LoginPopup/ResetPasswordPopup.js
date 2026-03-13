import React, { useState, useEffect } from "react";
// import "./ResetPasswordPopup.css";

const ResetPasswordPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(75); // Timer state to count down from 75 seconds
  const [isTimerActive, setIsTimerActive] = useState(false); // Whether the timer is active or not

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1); // Decrement timer every second
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval); // Stop the interval when timer reaches 0
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount or timer stop
  }, [isTimerActive, timer]);

  const requestOtp = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      setMessageType("error");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/sendotp?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
     

      if (response.ok && data.message.includes("OTP sent successfully")) {
        setMessage("OTP sent successfully. Check your email.");
        setMessageType("success");
        setStep(2);
        setIsTimerActive(true); // Start the timer after OTP is sent
        setTimer(75); // Reset timer to 75 seconds
      } else {
        setMessage(data.message || "Failed to send OTP.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Enter and confirm your new password.");
      setMessageType("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setMessageType("error");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/User/resetpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: Number(otp), newPassword }),
      });
      const data = await response.json();
      

      if (response.ok && data.success) {
        setMessage("Password reset successful! Log in now.");
        setMessageType("success");
        setTimeout(() => onClose(), 2000);
      } else {
        setMessage(data.message || "Failed to reset password.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-overlay" onClick={onClose}>
      <div
        className="reset-password-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h3>{step === 1 ? "Forgot Password" : "Reset Password"}</h3>
        {message && <p className={`message ${messageType}`}>{message}</p>}

        {step === 1 && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={requestOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            {/* Show the timer for waiting */}
            {isTimerActive && (
              <div>
                <p>Wait for {timer} seconds to request a new OTP</p>
              </div>
            )}
            
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button onClick={resetPassword} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPopup;
