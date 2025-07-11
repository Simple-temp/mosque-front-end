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
    role: "fixed",
    address: "",
    password: "",
    retypePassword: "",
  });

  const [numberMessage, setNumberMessage] = useState("");

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "number") {
      const numberRegex = /^01[2,3,4,5,6,7,8,9]\d{8}$/;
      if (value.length === 11 && numberRegex.test(value)) {
        setNumberMessage("✅ Number complete");
      } else {
        setNumberMessage("");
      }
    }
  };

  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({
      name: "",
      number: "",
      email: "",
      address: "",
      password: "",
      retypePassword: "",
      role: "fixed",
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://mosque-back-end.onrender.com/api/fixed-users"
      );
      const fixedUsers = res.data;

      const collectionRes = await axios.get(
        "https://mosque-back-end.onrender.com/api/users"
      );
      const collections = collectionRes.data;

      const updatedUsers = fixedUsers.map((user) => {
        // Filter collections that belong to this fixed user
        const userCollections = collections.filter(
          (entry) => entry.submittedByFixedUser === user._id
        );

        let total = 0;

        userCollections.forEach((entry) => {
          if (entry.userType === "normal" && entry.amount) {
            total += Number(entry.amount);
          } else if (entry.userType === "special" && entry.paidAmount) {
            total += Number(entry.paidAmount);
          }
        });

        return {
          ...user,
          totalCollection: total,
          collectionCount: userCollections.length,
          actualAmount:
            (Number(user.fixedAmount) || 0) - (Number(user.paidAmount) || 0),
        };
      });

      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && form.password !== form.retypePassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const payload = { ...form };
      delete payload.retypePassword;

      if (editingId) {
        await axios.put(
          `https://mosque-back-end.onrender.com/api/fixed-users/${editingId}`,
          payload
        );
        toast.success("User Updated");
      } else {
        await axios.post(
          "https://mosque-back-end.onrender.com/api/fixed-users",
          payload
        );
        toast.success("User Added");
      }

      fetchUsers();
      handleClose();
    } catch (err) {
      console.error("Error submitting user", err);
      toast.error("Failed to submit user");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record? it's also delete the user all record data"
    );
    if (!confirmDelete) return;

    await axios.delete(
      `https://mosque-back-end.onrender.com/api/fixed-users/${id}`
    );
    fetchUsers();
    toast.success("Delete user!");
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditingId(user._id);
    setOpen(true);
  };

  const LoggedInUser = JSON.parse(localStorage.getItem("adminUser"));
  const userId = LoggedInUser?._id;

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
                <TableCell sx={{ backgroundColor: "#e8f5e9" }}>
                  Total Collection
                </TableCell>
                <TableCell sx={{ backgroundColor: "#e8f5e9" }}>Count</TableCell>
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
                  <TableCell sx={{ backgroundColor: "#e8f5e9" }}>
                    {user.collectionCount}
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
                      disabled={
                        !(user._id === userId || LoggedInUser?.role === "admin")
                      }
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
                      disabled={
                        !(user._id === userId || LoggedInUser?.role === "admin")
                      }
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
              onChange={handleChangeNumber}
              margin="normal"
              required
              inputProps={{ maxLength: 11 }}
            />
            {numberMessage && (
              <Typography
                variant="body2"
                style={{ color: "green", marginTop: "-10px" }}
              >
                {numberMessage}
              </Typography>
            )}

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
            {!editingId && (
              <>
                <TextField
                  label="Password"
                  name="password"
                  fullWidth
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="Re-type Password"
                  name="retypePassword"
                  fullWidth
                  type="password"
                  value={form.retypePassword}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </>
            )}

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
