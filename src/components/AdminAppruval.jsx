import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";

const AdminAppruval = () => {
  const [collections, setCollections] = useState([]);
  const [confirmedUsers, setConfirmedUsers] = useState([]);

  // ✅ Format createdAt to BD time (12-hour format)
  const formatDateBD = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // ✅ Fetch all fixedUserCollections
  const fetchCollections = async () => {
    try {
      const res = await axios.get(
        "https://mosque-back-end.onrender.com/api/fixed-user-collections"
      );
      setCollections(res.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  // ✅ Confirm handler: Approve users created by this fixed user
  const handleConfirm = async (fixedUserId) => {
    console.log(fixedUserId);
    try {
      await axios.put(
        `https://mosque-back-end.onrender.com/api/users/approve/${fixedUserId}`
      );
      setConfirmedUsers((prev) => [...prev, fixedUserId]);
    } catch (error) {
      console.error("Error confirming user approval:", error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async (collectionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://mosque-back-end.onrender.com/api/fixed-user-collections/${collectionId}`
      );
      setCollections((prev) =>
        prev.filter((entry) => entry._id !== collectionId)
      );
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: "#00c853" }}>
        Admin Approval Panel
      </Typography>

      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collections.map((entry) => (
              <TableRow key={entry._id}>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.email}</TableCell>
                <TableCell>{entry.number}</TableCell>
                <TableCell>{entry.role}</TableCell>
                <TableCell>{entry.totalAmount}</TableCell>
                <TableCell>{formatDateBD(entry.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleConfirm(entry.submittedByFixedUser)}
                    disabled={confirmedUsers.includes(
                      entry.submittedByFixedUser
                    )}
                    sx={{
                      backgroundColor: confirmedUsers.includes(
                        entry.submittedByFixedUser
                      )
                        ? "#9ccc65"
                        : "#4caf50",
                      color: "#fff",
                      ":hover": { backgroundColor: "#388e3c" },
                    }}
                  >
                    {confirmedUsers.includes(entry.submittedByFixedUser)
                      ? "Confirmed"
                      : "Confirm"}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    sx={{
                      backgroundColor: "#f44336",
                      color: "#fff",
                      ":hover": { backgroundColor: "#d32f2f" },
                    }}
                    onClick={() => handleDelete(entry._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminAppruval;
