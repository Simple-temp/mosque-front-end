import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const LoginPage = () => {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!number || !password) {
      toast.error("Phone number and password are required");
      return;
    }

    try {
      // 🔹 Step 1: Try admin login
      const res = await axios.post("http://localhost:3000/api/admin/login", {
        number,
        password,
      });

      const { user, token } = res.data;

      localStorage.setItem("adminUser", JSON.stringify(user));
      localStorage.setItem("adminToken", token);

      toast.success("Admin Login Successful");
      setNumber("");
      setPassword("");
      navigate("/dashboard/dashboardoverview");
    } catch (adminErr) {
      // 🔸 Step 2: Try fixed user fallback
      try {
        const fixedRes = await axios.get("http://localhost:3000/api/fixed-users");

        const matchedUser = fixedRes.data.find(
          (u) => u.number === number
        );

        if (matchedUser) {
          localStorage.setItem("adminUser", JSON.stringify(matchedUser));
          localStorage.setItem("adminToken", matchedUser.token);
          toast.success("Fixed User Login Successful");
          setNumber("");
          setPassword("");
          navigate("/dashboard/dashboardoverview");
        } else {
          toast.error("Invalid phone number or password");
        }
      } catch (fixedErr) {
        toast.error("Login failed. Please try again.");
        console.error("Fixed login error:", fixedErr);
      }
    }
  };

  return (
    <div className="bg-container">
      <div className="inner-box">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="inner-box-size">
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
