import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const FixedAmountPage = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    number: "",
    email: "",
    address: "",
  });
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [collections, SetCollections] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: "", number: "", email: "", address: "" });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:3000/api/fixed-users");
    const fixedUsers = res.data;

    const collectionRes = await axios.get("http://localhost:3000/api/users");
    const collections = collectionRes.data;

    // Create a new list with totalCollection calculated
    const updatedUsers = fixedUsers.map((user) => {
      const matchedData = collections.filter(
        (item) => String(item.number).trim() === String(user.number).trim()
      );

      console.log(matchedData);

      let total = 0;

      matchedData.forEach((entry) => {
        if (entry.userType === "normal" && entry.amount) {
          total += Number(entry.amount);
        }
        if (entry.userType === "special" && entry.paidAmount) {
          total += Number(entry.paidAmount);
        }
      });

      return {
        ...user,
        totalCollection: total,
      };
    });

    setUsers(updatedUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3000/api/fixed-users/${editingId}`,
          form
        );
        toast.success("User Updated");
      } else {
        await axios.post("http://localhost:3000/api/fixed-users", form);
        toast.success("User Addedd");
      }
      fetchUsers();
      handleClose();
    } catch (err) {
      console.error("Error submitting user", err);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/fixed-users/${id}`);
    fetchUsers();
    toast.success("Delete user!");
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditingId(user._id);
    setOpen(true);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Typography variant="h5" sx={{ color: "#00c853", marginBottom: 2 }}>
        Fixed User Page
      </Typography>

      <Box className="inner-fixed-user-box" sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#00c853", marginBottom: 2 }}
          onClick={handleOpen}
        >
          Add a Fixed Amount User
        </Button>

        <Paper sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Number</TableCell>
                <TableCell sx={{ backgroundColor: "#fff9c4" }}>Email</TableCell>
                <TableCell sx={{ backgroundColor: "#c8e6c9" }}>
                  Address
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fff9c4" }}>
                  Total Collection
                </TableCell>
                <TableCell sx={{ backgroundColor: "#ffcdd2" }}>
                  Delete
                </TableCell>
                <TableCell sx={{ backgroundColor: "#bbdefb" }}>
                  Update
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.number}</TableCell>
                  <TableCell sx={{ backgroundColor: "#fffde7" }}>
                    {user.email}
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#e8f5e9" }}>
                    {user.address}
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#fff9c4" }}>
                    {user.totalCollection}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      sx={{
                        backgroundColor: "#e53935",
                        color: "white",
                        ":hover": { backgroundColor: "#b71c1c" },
                      }}
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      sx={{
                        backgroundColor: "#42a5f5",
                        color: "white",
                        ":hover": { backgroundColor: "#1e88e5" },
                      }}
                      onClick={() => handleEdit(user)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: 400,
            p: 4,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 24,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" sx={{ color: "#00c853", mb: 2 }}>
            {editingId ? "Update Fixed Amount User" : "Add Fixed Amount User"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              label="Number"
              name="number"
              fullWidth
              value={form.number}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              margin="normal"
              type="email"
              required
            />
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={form.address}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#00c853",
                  ":hover": { backgroundColor: "#00b341" },
                  width: "48%",
                }}
              >
                {editingId ? "Update" : "Submit"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClose}
                sx={{ width: "48%" }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default FixedAmountPage;
