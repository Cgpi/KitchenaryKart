import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { X } from "lucide-react";
import { Country, State } from "country-state-city";

const UserRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    state: "",
    country: "",
    pincode: "",
    contactNumber: "",
    emailOtp: "",
  });

  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [timer, setTimer] = useState(75); // Timer state to count down from 75 seconds
  const [isTimerActive, setIsTimerActive] = useState(false); // Whether the timer is active or not

  useEffect(() => {
    setLoaded(true);
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendOtp = async () => {
    if (!formData.email) {
      setMessage("Please enter your email first.");
      return;
    }

    setOtpLoading(true);
    setMessage(""); // Clear any previous messages

    try {
      const response = await api.get(`/User/send_registration_otp`, {
        params: { email: formData.email },
      });

      setMessage(response.data.message || "OTP sent to your email.");
      setOtpSent(true);
      setIsTimerActive(true); // Start the timer after OTP is sent
      setTimer(75); // Reset timer to 75 seconds
    } catch (error) {
      
      setMessage(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        emailOtp: formData.emailOtp.trim(),
      };

     

      const response = await api.post(`/User/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

     
      setMessage(response.data.message);

      if (response.data.success) {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const countries = Country.getAllCountries();
  const states = formData.country
    ? State.getStatesOfCountry(
        countries.find((c) => c.name === formData.country)?.isoCode
      ) || []
    : [];

  return (
    <>
  <Helmet>
    <title>User Registration | Kitchenary Kart</title>
    <meta
      name="description"
      content="Register at Kitchenary Kart to enjoy quick checkout, exclusive offers, and manage your orders easily."
    />
    <link
      rel="canonical"
      href="https://www.kitchenarykart.com/user-registration"
    />
    <meta name="robots" content="index, follow" />
  </Helmet>

  {loaded && (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="w-11/12 max-w-md bg-white rounded-lg shadow-2xl p-6 relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>

        <h2 className="text-center text-lg font-semibold mb-4">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={sendOtp}
              disabled={otpLoading || !formData.email}
              className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 border border-gray-300 rounded-md py-2 text-xs font-medium transition disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {otpLoading && <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>}
              {otpLoading ? "Sending..." : otpSent ? "Resend OTP" : "Verify Email"}
            </button>

            {otpSent && (
              <input
                type="text"
                placeholder="OTP"
                name="emailOtp"
                value={formData.emailOtp}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            )}
          </div>

          {otpSent && isTimerActive && (
            <p className="text-xs text-gray-600 text-center">
              Wait for {timer} seconds to request a new OTP
            </p>
          )}

          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>

            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              disabled={!formData.country}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="tel"
              placeholder="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-red-700 rounded-full animate-spin"></div>}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <p className="text-center text-gray-600 text-xs mt-3 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  )}
    </>
  );
};

export default UserRegistration;



