import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyAccount = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const getUserData = async () => {
    try {
      const localUser = JSON.parse(localStorage.getItem("adminUser"));
      const userId = localUser?._id;
      const role = localUser?.role;

      const api =
        role === "admin"
          ? `http://localhost:3000/api/admin/${userId}`
          : `http://localhost:3000/api/fixed-users/${userId}`;

      const res = await axios.get(api);
      const data = res.data;

      setUserData(data);
      setFormData({
        name: data.name || "",
        number: data.number || "",
        email: data.email || "",
        address: data.address || "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error("Failed to fetch user data");
      console.error(err);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleUpdate = async () => {
    const { name, number, address, email, password, confirmPassword } = formData;

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const localUser = JSON.parse(localStorage.getItem("adminUser"));
      const userId = localUser?._id;
      const role = localUser?.role;

      const api =
        role === "admin"
          ? `http://localhost:3000/api/admin/${userId}`
          : `http://localhost:3000/api/fixed-users/${userId}`;

      const payload = { name, number, address, email };
      if (password) payload.password = password;

      const res = await axios.put(api, payload);

      toast.success("✅ Profile updated successfully");
      getUserData(); // Refresh data
      console.log(res)
    } catch (err) {
      toast.error("❌ Failed to update profile");
      console.error(err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (!userData) return null;

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" color="primary" gutterBottom>
          My Account
        </Typography>

        <Typography variant="subtitle1">Role: {userData.role}</Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleChange("name")}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              value={formData.email}
              onChange={handleChange("email")}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Number"
              value={formData.number}
              onChange={handleChange("number")}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              value={formData.address}
              onChange={handleChange("address")}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="New Password"
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Re-type Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="success" onClick={handleUpdate}>
              Update Account
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MyAccount;
