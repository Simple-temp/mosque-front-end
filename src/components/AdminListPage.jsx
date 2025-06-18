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

const AdminListPage = () => {
  const [admins, setAdmins] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    number: "",
    address: "",
    role: "admin",
    email: "",
  });
  const [currentId, setCurrentId] = useState(null);

  const fetchAdmins = async () => {
    const res = await axios.get("http://localhost:3000/api/admin");
    setAdmins(res.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3000/api/admin/create", adminData);
    fetchAdmins();
    handleClose();
    toast.success("User Addedd");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:3000/api/admin/${currentId}`, adminData);
    fetchAdmins();
    handleClose();
    toast.success("User Updated");
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/admin/${id}`);
    fetchAdmins();
    toast.success("Delete user!");
  };

  const handleOpenCreate = () => {
    setAdminData({
      name: "",
      number: "",
      address: "",
      role: "admin",
      email: "",
    });
    setOpenCreate(true);
  };

  const handleOpenUpdate = (admin) => {
    setAdminData(admin);
    setCurrentId(admin._id);
    setOpenUpdate(true);
  };

  const handleClose = () => {
    setOpenCreate(false);
    setOpenUpdate(false);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Typography variant="h5" sx={{ color: "#00c853", mb: 2 }}>
        Admin List Page
      </Typography>

      <Button
        variant="contained"
        sx={{ backgroundColor: "#00c853", mb: 2 }}
        onClick={handleOpenCreate}
      >
        Create Admin User
      </Button>

      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(admins) &&
              admins.map((admin, index) => (
                <TableRow key={admin._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell>{admin.number}</TableCell>
                  <TableCell>{admin.address}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      sx={{
                        backgroundColor: "#e53935",
                        color: "white",
                        ":hover": { backgroundColor: "#b71c1c" },
                      }}
                      onClick={() => handleDelete(admin._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "white",
                        ":hover": { backgroundColor: "#2e7d32" },
                      }}
                      onClick={() => handleOpenUpdate(admin)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>

      <Modal open={openCreate || openUpdate} onClose={handleClose}>
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
            {openCreate ? "Create New Admin" : "Update Admin"}
          </Typography>

          <form onSubmit={openCreate ? handleCreate : handleUpdate}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={adminData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              label="Number"
              name="number"
              fullWidth
              value={adminData.number}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={adminData.address}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              label="Role"
              name="role"
              fullWidth
              value={adminData.role}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={adminData.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Box
              sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "#00c853" }}
              >
                Submit
              </Button>
              <Button onClick={handleClose} variant="outlined" color="error">
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminListPage;
