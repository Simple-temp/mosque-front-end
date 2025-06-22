import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MyHistoray = () => {
  const [users, setUsers] = useState([]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      hour12: true,
    });
  };

  const fetchUserHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("adminUser"));
      const userId = user?._id;

      const res = await axios.get(
        "https://mosque-back-end.onrender.com/api/users"
      );
      const data = res.data;

      const filteredData = data.filter(
        (item) =>
          item.submittedByFixedUser === userId ||
          item.submittedByAdmin === userId
      );

      setUsers(filteredData);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  useEffect(() => {
    fetchUserHistory();
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
      fetchUserHistory();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const getRowStyle = (user) => {
    if (user?.fixedAmount && user?.paidAmount < user?.fixedAmount) {
      return { backgroundColor: "#fff3e0" }; // light orange
    }
    if (user?.fixedAmount && user?.paidAmount >= user?.fixedAmount) {
      return { backgroundColor: "#e8f5e9" }; // light green
    }
    if (!user?.fixedAmount && user?.amount) {
      return { backgroundColor: "#e3f2fd" }; // light blue for normal user
    }
    return {};
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        My History
      </Typography>
      <TableContainer component={Paper}>
        <div className="search-filer-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Fix Amount</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Due Amount</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, idx) => (
                <TableRow key={user._id} style={getRowStyle(user)}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{formatTimestamp(user.timestamp)}</TableCell>
                  <TableCell>{user?.name}</TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>{user?.number}</TableCell>
                  <TableCell>{user?.address}</TableCell>
                  <TableCell>{user?.fixedAmount || "-"}</TableCell>
                  <TableCell>
                    {user?.paidAmount || user?.amount || "-"}
                  </TableCell>
                  <TableCell>
                    {user?.fixedAmount
                      ? user?.fixedAmount - user?.paidAmount
                      : "-"}
                  </TableCell>
                  <TableCell>{user?.role || "General"}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
    </Box>
  );
};

export default MyHistoray;
