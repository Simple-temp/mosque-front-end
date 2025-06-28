import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
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
import DeleteIcon from "@mui/icons-material/Delete";
import IndividualSearch from "./IndividualSearch";

const FixedUserList = () => {
  const greenOutline = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#00c853" },
      "&:hover fieldset": { borderColor: "#00c853" },
      "&.Mui-focused fieldset": { borderColor: "#00c853" },
    },
  };

  const [specialUser, setSpecialUser] = useState({
    name: "",
    address: "",
    number: "",
    paidAmount: "",
    email: "",
    fixedAmount: "",
    role: "",
  });

  const [numberMessageSpecial, setNumberMessageSpecial] = useState("");
  const [fixedUsers, setFixedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const handleSpecialChange = (field) => (e) => {
    const value = e.target.value;
    setSpecialUser((prev) => ({ ...prev, [field]: value }));

    if (field === "number") {
      const numberRegex = /^01[2-9]\d{8}$/;
      if (value.length === 11 && numberRegex.test(value)) {
        setNumberMessageSpecial("✅ Number complete");
      } else {
        setNumberMessageSpecial("");
      }
    }
  };

  const handleSubmitSpecial = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const userType = JSON.parse(localStorage.getItem("adminUser"));
      const adminId = userType?._id;

      const payload = {
        ...specialUser,
        userType: "special",
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

      toast.success("🎊 Special user registered!");
      setSpecialUser({
        name: "",
        address: "",
        number: "",
        paidAmount: "",
        email: "",
        fixedAmount: "",
        role: "",
      });
      fetchUsers(); // Refresh the table
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("⚠️ Number or email already exists!");
      } else {
        toast.error("❌ Failed to register special user!");
      }
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://mosque-back-end.onrender.com/api/users"
      );
      const usersWithFixedAmount = res.data.filter((u) => u.fixedAmount);
      setFixedUsers(usersWithFixedAmount);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(
        `https://mosque-back-end.onrender.com/api/users/${id}`
      );
      setFixedUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete user");
    }
  };

  const paginatedData = fixedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      hour12: true,
    });
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
      <IndividualSearch />
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="#00c853" gutterBottom>
          Fixed User Registration
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <Select
                value={specialUser.role}
                onChange={handleSpecialChange("role")}
                displayEmpty
                required
              >
                <MenuItem value="" disabled>
                  Select EID
                </MenuItem>
                <MenuItem value="EID-UL-FITR">EID-UL-FITR</MenuItem>
                <MenuItem value="EID-UL-ADHA">EID-UL-ADHA</MenuItem>
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
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmitSpecial}
          >
            Submit
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" color="#00c853" gutterBottom>
        Fixed User List
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          mt: 4,
          border: "1px solid #b0bec5",
          borderRadius: "8px",
        }}
      >
        <Table sx={{ borderCollapse: "collapse" }}>
          <TableHead sx={{ backgroundColor: "#e0f2f1" }}>
            <TableRow>
              {[
                "ID",
                "Date",
                "Name",
                "Email",
                "Number",
                "Address",
                "Fix Amount",
                "Paid",
                "Due Amount",
                "Season",
                "Delete",
              ].map((label) => (
                <TableCell
                  key={label}
                  sx={{ border: "1px solid #b0bec5", fontWeight: "bold" }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((user, index) => {
              const due =
                Number(user.fixedAmount || 0) - Number(user.paidAmount || 0);
              return (
                <TableRow key={user._id}>
                  <TableCell sx={{ border: "1px solid #b0bec5" }}>
                    {index + 1 + (currentPage - 1) * rowsPerPage}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #b0bec5" }}>
                    {formatTimestamp(user.timestamp)}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #b0bec5" }}>
                    {user.name}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #b0bec5" }}>
                    {user.email}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #b0bec5" }}>
                    {user.number}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #b0bec5" }}>
                    {user.address}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #b0bec5",
                      color: "#1565c0",
                      fontWeight: 600,
                    }}
                  >
                    {user.fixedAmount}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #b0bec5",
                      color: "#2e7d32",
                      fontWeight: 600,
                    }}
                  >
                    {user.paidAmount}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #b0bec5",
                      color: due > 0 ? "#d32f2f" : "#2e7d32",
                      fontWeight: 600,
                    }}
                  >
                    {due}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #b0bec5" }}>
                    {user.role}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #b0bec5" }}>
                    <IconButton
                      color="error"
                      onClick={() => {
                        handleDelete(user._id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(fixedUsers.length / rowsPerPage)}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>
    </div>
  );
};

export default FixedUserList;
