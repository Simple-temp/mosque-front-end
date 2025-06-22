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
    password: "",
    retypePassword: "",
    email: "",
  });

  const token = JSON.parse(localStorage.getItem("adminToken"));

  const [numberMessage, setNumberMessage] = useState("");

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;

    setAdminData((prev) => ({
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

  const [currentId, setCurrentId] = useState(null);

  const fetchAdmins = async () => {
    const res = await axios.get("http://localhost:3000/api/admin");
    setAdmins(res.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (adminData.password !== adminData.retypePassword) {
      toast.error("Passwords do not match");
      return;
    }

    const { retypePassword, ...dataToSend } = adminData;
    console.log(retypePassword);

    try {
      await axios.post("http://localhost:3000/api/admin/create", dataToSend);
      fetchAdmins();
      handleClose();
      toast.success("User Added");
    } catch (err) {
      toast.error("Failed to create user");
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { retypePassword, ...dataToSend } = adminData;
    console.log(retypePassword);

    try {
      await axios.put(
        `http://localhost:3000/api/admin/${currentId}`,
        dataToSend,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      fetchAdmins();
      handleClose();
      toast.success("User Updated");
    } catch (err) {
      toast.error("Failed to update user");
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/${id}`);
      fetchAdmins();
      toast.success("User Deleted");
    } catch (err) {
      toast.error("Failed to delete user");
      console.log(err);
    }
  };

  const handleOpenCreate = () => {
    setAdminData({
      name: "",
      number: "",
      address: "",
      role: "admin",
      password: "",
      retypePassword: "",
      email: "",
    });
    setOpenCreate(true);
  };

  const handleOpenUpdate = (admin) => {
    setAdminData({ ...admin, password: "", retypePassword: "" });
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
              label="Address"
              name="address"
              fullWidth
              value={adminData.address}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={adminData.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            {openCreate && (
              <>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  value={adminData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="Re-type Password"
                  name="retypePassword"
                  type="password"
                  fullWidth
                  value={adminData.retypePassword}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </>
            )}

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
