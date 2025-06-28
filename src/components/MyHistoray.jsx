import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TabPanel = ({ children, value, index }) => {
  return value === index && <Box sx={{ mt: 2 }}>{children}</Box>;
};

const MyDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [collections, setCollections] = useState([]);
  const [totalCollection, setTotalCollection] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const LoggedInUser = JSON.parse(localStorage.getItem("adminUser"));
  const userId = LoggedInUser?._id;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      hour12: true,
    });
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://mosque-back-end.onrender.com/api/users"
      );
      const data = res.data;
      const filtered = data.filter(
        (u) =>
          u.submittedByFixedUser === userId || u.submittedByAdmin === userId
      );
      setUsers(filtered);
    } catch {
      toast.error("Failed to fetch history");
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await axios.get(
        "https://mosque-back-end.onrender.com/api/fixed-user-collections"
      );
      setCollections(res.data);
    } catch {
      toast.error("Failed to fetch collections");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCollections();
  }, []);

  const matchedUsers = useMemo(() => {
    return users.filter(
      (u) => u.submittedByFixedUser === userId || u.submittedByAdmin === userId
    );
  }, [users]);

  useEffect(() => {
    const total = matchedUsers.reduce((acc, cur) => {
      return acc + (cur.paidAmount || cur.amount || 0);
    }, 0);
    setTotalCollection(total);
  }, [matchedUsers]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this record?");
    if (!confirm) return;
    try {
      await axios.delete(
        `https://mosque-back-end.onrender.com/api/users/${id}`
      );
      toast.success("Deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSubmitCollection = async () => {
    try {
      const payload = {
        name: LoggedInUser?.name,
        email: LoggedInUser?.email,
        number: LoggedInUser?.number,
        role: LoggedInUser?.role,
        totalAmount: totalCollection,
        submittedByFixedUser: userId,
        isApproved: false,
      };
      await axios.post(
        "https://mosque-back-end.onrender.com/api/fixed-user-collections",
        payload
      );
      setSubmitted(true);
      toast.success("Submitted as pending!");
      fetchCollections();
    } catch {
      toast.error("Submission failed");
    }
  };

  const getRowStyle = (user) => {
    if (user?.isApproved) return { backgroundColor: "#e0e0e0" };
    if (user?.fixedAmount && user?.paidAmount < user?.fixedAmount)
      return { backgroundColor: "#fff3e0" };
    if (user?.fixedAmount && user?.paidAmount >= user?.fixedAmount)
      return { backgroundColor: "#e8f5e9" };
    if (!user?.fixedAmount && user?.amount)
      return { backgroundColor: "#e3f2fd" };
    return {};
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom color="#00c853">
        My History
      </Typography>
      <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)}>
        <Tab label="My History" />
        <Tab label="Pending" />
        <Tab label="Approved" />
      </Tabs>

      {/* Tab 1: My History */}
      <TabPanel value={tabIndex} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Fix Amount</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matchedUsers.map((user, idx) => (
                <TableRow key={user._id} style={getRowStyle(user)}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{formatDate(user.timestamp)}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.number}</TableCell>
                  <TableCell>{user.fixedAmount || "-"}</TableCell>
                  <TableCell>{user.paidAmount || user.amount || "-"}</TableCell>
                  <TableCell>
                    {user.fixedAmount
                      ? user.fixedAmount - user.paidAmount
                      : "-"}
                  </TableCell>
                  <TableCell>{user.role || "General"}</TableCell>
                  <TableCell>
                    {!user?.isApproved && (
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(user._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Typography variant="h6">
            Total Collection: {totalCollection} Taka{" "}
          </Typography>
          <Button
            variant="contained"
            onClick={handleSubmitCollection}
            disabled={submitted || matchedUsers.length === 0}
          >
            Submit Collection
          </Button>
        </Box>
      </TabPanel>

      {/* Tab 2: Pending Collections (Only Logged-in User) */}
      <TabPanel value={tabIndex} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collections
                .filter(
                  (c) => !c.isApproved && c.submittedByFixedUser === userId
                )
                .map((c, idx) => (
                  <TableRow key={c._id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{formatDate(c.createdAt)}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email || "-"}</TableCell>
                    <TableCell>{c.number}</TableCell>
                    <TableCell>{c.role}</TableCell>
                    <TableCell>{c.totalAmount}</TableCell>
                    <TableCell>
                      <span style={{ color: "orange" }}>Pending</span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab 3: Approved Collections (Only Logged-in User) */}
      <TabPanel value={tabIndex} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collections
                .filter(
                  (c) => c.isApproved && c.submittedByFixedUser === userId
                )
                .map((c, idx) => (
                  <TableRow key={c._id} style={{ backgroundColor: "#e8f5e9" }}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{formatDate(c.createdAt)}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email || "-"}</TableCell>
                    <TableCell>{c.number}</TableCell>
                    <TableCell>{c.role}</TableCell>
                    <TableCell>{c.totalAmount}</TableCell>
                    <TableCell>
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Approved
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default MyDashboard;
