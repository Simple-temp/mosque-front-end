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
      // ✅ Step 1: Try Fixed User Login
      const fixedUserRes = await axios.post("http://localhost:3000/api/fixed-users/login", {
        number,
        password,
      });

      const fixedUser = fixedUserRes.data.user;
      const fixedToken = fixedUserRes.data.token;

      localStorage.setItem("adminUser", JSON.stringify(fixedUser));
      localStorage.setItem("adminToken", fixedToken);

      toast.success("Fixed User Login Successful");
      setNumber("");
      setPassword("");
      navigate("/dashboard/dashboardwelcome");

    } catch (fixedErr) {
      // ❌ Step 2: If fixed user login failed, try admin login
      console.log(fixedErr)
      try {
        const adminRes = await axios.post("http://localhost:3000/api/admin/login", {
          number,
          password,
        });

        const adminUser = adminRes.data.user;
        const adminToken = adminRes.data.token;

        localStorage.setItem("adminUser", JSON.stringify(adminUser));
        localStorage.setItem("adminToken", adminToken);

        toast.success("Admin Login Successful");
        setNumber("");
        setPassword("");
        navigate("/dashboard/dashboardwelcome");

      } catch (adminErr) {
        toast.error("Invalid phone number or password");
        console.error("Admin login error:", adminErr);
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
