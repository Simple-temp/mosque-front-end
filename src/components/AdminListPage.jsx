import React, { useState } from "react";
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

const AdminListPage = () => {
  const [open, setOpen] = useState(false);
  const [adminData, setAdminData] = useState({ name: "", number: "" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAdminData({ name: "", number: "" });
  };

  const handleInputChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Admin Data:", adminData);
    handleClose();
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ color: "#00c853", marginBottom: 2 }}>
        Admin List Page
      </Typography>

      <Button
        variant="contained"
        sx={{ backgroundColor: "#00c853", marginBottom: 2 }}
        onClick={handleOpen}
      >
        Create Admin User
      </Button>

      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell sx={{ backgroundColor: "#fff9c4" }}>Role</TableCell>
              <TableCell sx={{ backgroundColor: "#c8e6c9" }}>Paid Amount</TableCell>
              <TableCell sx={{ backgroundColor: "#ffcdd2" }}>Delete</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((id) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>Admin {id}</TableCell>
                <TableCell sx={{ backgroundColor: "#fffde7" }}>Admin</TableCell>
                <TableCell sx={{ backgroundColor: "#e8f5e9" }}>${id * 100}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    sx={{
                      backgroundColor: "#e53935",
                      color: "white",
                      ":hover": { backgroundColor: "#b71c1c" },
                    }}
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
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Material UI Modal */}
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
            Create New Admin
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={adminData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              label="Number"
              name="number"
              fullWidth
              value={adminData.number}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
              <Button type="submit" variant="contained" sx={{ backgroundColor: "#00c853" }}>
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
