import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  InputLabel,
  FormControl,
} from "@mui/material";

const FixedAmountPage = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    number: "",
    role: "admin",
    fixedAmount: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: "", number: "", role: "admin", fixedAmount: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Fixed Amount User:", form);
    handleClose();
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ color: "#00c853", marginBottom: 2 }}>
        Fixed Amount Page
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
                <TableCell sx={{ backgroundColor: "#fff9c4" }}>Fixed Amount</TableCell>
                <TableCell sx={{ backgroundColor: "#c8e6c9" }}>Paid Amount</TableCell>
                <TableCell sx={{ backgroundColor: "#ffcdd2" }}>Delete</TableCell>
                <TableCell sx={{ backgroundColor: "#bbdefb" }}>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3, 4, 5].map((id) => (
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>User {id}</TableCell>
                  <TableCell>017000000{id}</TableCell>
                  <TableCell sx={{ backgroundColor: "#fffde7" }}>${id * 100}</TableCell>
                  <TableCell sx={{ backgroundColor: "#e8f5e9" }}>${id * 80}</TableCell>
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
                        backgroundColor: "#42a5f5",
                        color: "white",
                        ":hover": { backgroundColor: "#1e88e5" },
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
      </Box>

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
            Add Fixed Amount User
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
            <FormControl fullWidth margin="normal">
              <Select
                labelId="role-label"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="VIP">VIP</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Fixed Amount"
              name="fixedAmount"
              fullWidth
              value={form.fixedAmount}
              onChange={handleChange}
              margin="normal"
              required
              type="number"
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

export default FixedAmountPage;
