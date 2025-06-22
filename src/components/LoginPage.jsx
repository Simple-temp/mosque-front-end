import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const LoginPage = () => {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Token = JSON.parse(localStorage.getItem("adminToken"));
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!number || !password) {
      toast.error("Phone number and password are required");
      return;
    }

    try {
      // ✅ Step 1: Try Admin Login
      const userRes = await axios.post(
        "https://mosque-back-end.onrender.com/api/admin/login", // Assuming you have a login endpoint for users
        {
          number,
          password,
        },
        {
          headers: { authorization: `Bearer ${Token}` },
        }
      );

      const user = userRes.data.user;
      const token = userRes.data.token;

      localStorage.setItem("adminUser", JSON.stringify(user));
      localStorage.setItem("adminToken", token);

      toast.success("Admin Login Successful");
      setNumber("");
      setPassword("");
      navigate("/dashboard/dashboardwelcome");
    } catch (userErr) {
      console.log("User login failed, checking fixed user...");
      console.log(userErr);

      try {
        // ❌ Step 2: If user login failed, try fixed user login
        const fixedUserRes = await axios.post(
          "https://mosque-back-end.onrender.com/api/fixed-users/login",
          {
            number,
            password,
          },
          {
            headers: { authorization: `Bearer ${Token}` },
          }
        );

        const fixedUser = fixedUserRes.data.user;
        const fixedToken = fixedUserRes.data.token;

        localStorage.setItem("adminUser", JSON.stringify(fixedUser));
        localStorage.setItem("adminToken", fixedToken);

        toast.success("Fixed User Login Successful");
        setNumber("");
        setPassword("");
        navigate("/dashboard/dashboardwelcome");
      } catch (fixedErr) {
        toast.error("Invalid phone number or password");
        console.error("Fixed user login error:", fixedErr);
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
