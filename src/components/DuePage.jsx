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
  Button,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

const DuePage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchDueUsers = async () => {
      try {
        const res = await axios.get(
          "https://mosque-back-end.onrender.com/api/due"
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching due users:", err);
      }
    };

    fetchDueUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`https://mosque-back-end.onrender.com/api/due/${id}`);
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      toast.error("Error deleting user");
      console.error("Delete error:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ color: "#00c853", marginBottom: 2 }}>
        Due Page
      </Typography>

      <ToastContainer position="top-right" autoClose={2000} />

      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Number</TableCell>
              <TableCell sx={{ backgroundColor: "#c8e6c9" }}>
                Paid Amount
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ffcdd2" }}>
                Due Amount
              </TableCell>
              <TableCell sx={{ backgroundColor: "#bbdefb" }}>
                Send Message
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ffcdd2" }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter(
                (user) =>
                  user.userType === "special" &&
                  Number(user.fixedAmount) > Number(user.paidAmount)
              )
              .map((user, index) => {
                const dueAmount =
                  Number(user.fixedAmount) - Number(user.paidAmount);

                return (
                  <TableRow key={user._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.number}</TableCell>
                    <TableCell sx={{ backgroundColor: "#e8f5e9" }}>
                      {user.paidAmount || 0}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#ffebee" }}>
                      {dueAmount}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#64b5f6",
                          color: "white",
                          ":hover": { backgroundColor: "#42a5f5" },
                        }}
                        onClick={() => alert(`Message sent to ${user.number}`)}
                      >
                        Send
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#e53935",
                          color: "white",
                          ":hover": { backgroundColor: "#c62828" },
                        }}
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default DuePage;
