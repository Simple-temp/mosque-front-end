import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

const AddNewRecord = () => {
  const greenOutline = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#00c853" },
      "&:hover fieldset": { borderColor: "#00c853" },
      "&.Mui-focused fieldset": { borderColor: "#00c853" },
    },
  };

  // Normal User State
  const [normalUser, setNormalUser] = useState({
    name: "",
    address: "",
    number: "",
    amount: "",
    email: "",
  });

  // Special User State
  // const [specialUser, setSpecialUser] = useState({
  //   name: "",
  //   address: "",
  //   number: "",
  //   paidAmount: "",
  //   email: "",
  //   fixedAmount: "",
  //   role: "",
  // });

  const [numberMessage, setNumberMessage] = useState("");
  // const [numberMessageSpecial, setNumberMessageSpecial] = useState("");

  const handleNormalChange = (field) => (e) => {
    const value = e.target.value;

    setNormalUser((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "number") {
      const numberRegex = /^01[2-9]\d{8}$/;
      if (value.length === 11 && numberRegex.test(value)) {
        setNumberMessage("✅ Number complete");
      } else {
        setNumberMessage("");
      }
    }
  };

  // const handleSpecialChange = (field) => (e) => {
  //   const value = e.target.value;

  //   setSpecialUser((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));

  //   if (field === "number") {
  //     const numberRegex = /^01[2-9]\d{8}$/;
  //     if (value.length === 11 && numberRegex.test(value)) {
  //       setNumberMessageSpecial("✅ Number complete");
  //     } else {
  //       setNumberMessageSpecial("");
  //     }
  //   }
  // };

  const handleSubmitNormal = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const userType = JSON.parse(localStorage.getItem("adminUser"));
      const adminData = JSON.parse(localStorage.getItem("adminUser"));
      const adminId = adminData?._id;

      // Prepare payload with submittedBy based on userType
      const payload = {
        ...normalUser,
        userType: "normal",
      };

      if (userType?.role === "admin") {
        payload.submittedByAdmin = adminId;
      } else if (userType?.role === "fixed") {
        payload.submittedByFixedUser = adminId;
      }

      const res = await axios.post(
        "https://mosque-back-end.onrender.com/api/add-user",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(res);

      toast.success("🎉 Normal user registered!");
      setNormalUser({
        name: "",
        address: "",
        number: "",
        amount: "",
        email: "",
      });
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("⚠️ Number or email already exists!");
      } else {
        toast.error("🚫 Failed to register normal user!");
      }
      console.error(error);
    }
  };

  // const handleSubmitSpecial = async () => {
  //   try {
  //     const token = localStorage.getItem("adminToken");
  //     const userType = JSON.parse(localStorage.getItem("adminUser"));
  //     const adminData = JSON.parse(localStorage.getItem("adminUser"));
  //     const adminId = adminData?._id;

  //     const payload = {
  //       ...specialUser,
  //       userType: "special",
  //     };

  //     if (userType?.role === "admin") {
  //       payload.submittedByAdmin = adminId;
  //     } else if (userType?.role === "fixed") {
  //       payload.submittedByFixedUser = adminId;
  //     }

  //     const res = await axios.post(
  //       "https://mosque-back-end.onrender.com/api/add-user",
  //       payload,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     console.log(res);

  //     toast.success("🎊 Special user registered!");
  //     setSpecialUser({
  //       name: "",
  //       address: "",
  //       number: "",
  //       paidAmount: "",
  //       email: "",
  //       fixedAmount: "",
  //       role: "",
  //     });
  //   } catch (error) {
  //     if (error.response?.status === 409) {
  //       toast.error("⚠️ Number or email already exists!");
  //     } else {
  //       toast.error("❌ Failed to register special user!");
  //     }
  //     console.error(error);
  //   }
  // };

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer position="top-right" autoClose={2000} />
      {/* 🔹 Normal User Form */}
      <Typography variant="h6" color="#00c853" gutterBottom>
        Normal User Registration
      </Typography>
      <Grid container spacing={2}>
        {["name", "address", "number", "amount", "email"].map((field) => (
          <Grid item xs={12} md={4} key={field}>
            <TextField
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={normalUser[field]}
              onChange={handleNormalChange(field)}
              fullWidth
              sx={greenOutline}
              inputProps={field === "number" ? { maxLength: 11 } : {}}
            />
          </Grid>
        ))}

        {numberMessage && (
          <Grid item xs={12} md={4}>
            <Typography
              variant="body2"
              style={{ color: "green", marginTop: "-10px" }}
            >
              {numberMessage}
            </Typography>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmitNormal}
        >
          Submit
        </Button>
      </Box>

      <Box mt={6} />

      {/* 🔸 Special User Form */}
      {/* <Typography variant="h6" color="#00c853" gutterBottom>
        Special User Registration
      </Typography> */}
      {/* <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <Select
              value={specialUser.role}
              onChange={handleSpecialChange("role")}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Role
              </MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {[
          "name",
          "address",
          "number",
          "paidAmount",
          "email",
          "fixedAmount",
        ].map((field) => (
          <Grid item xs={12} md={4} key={field}>
            <TextField
              label={
                field === "fixedAmount"
                  ? "Fixed Amount"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              value={specialUser[field]}
              onChange={handleSpecialChange(field)}
              fullWidth
              sx={greenOutline}
              inputProps={field === "number" ? { maxLength: 11 } : {}}
            />
            {field === "number" && numberMessageSpecial && (
              <Typography
                variant="body2"
                style={{ color: "green", marginTop: "-10px" }}
              >
                {numberMessageSpecial}
              </Typography>
            )}
          </Grid>
        ))}
      </Grid> */}
      {/* 
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmitSpecial}
        >
          Submit Special User
        </Button>
      </Box> */}
    </Box>
  );
};

export default AddNewRecord;
