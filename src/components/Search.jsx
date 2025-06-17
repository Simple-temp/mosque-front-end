import axios from "axios";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    number: "",
    address: "",
    role: "",
    email: "",
    userType: "",
    dateRange: "", // values: '', '12h', '1d', '7d', '14d'
  });

  // Fetch all users on mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/search")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Handle text inputs change
  const handleInputChange = (e) => {
    const { placeholder, value } = e.target;
    const key = placeholder.toLowerCase().split("by ")[1];
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle date range select change
  const handleDateChange = (e) => {
    setFilters((prev) => ({ ...prev, dateRange: e.target.value }));
  };

  // Helper: filter users by date range
  const filterByDateRange = (user) => {
    if (!filters.dateRange) return true; // no date filter

    const now = new Date();
    const createdAt = new Date(user.createdAt);

    switch (filters.dateRange) {
      case "12h":
        return createdAt >= new Date(now.getTime() - 12 * 60 * 60 * 1000);
      case "1d":
        return createdAt >= new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "7d":
        return createdAt >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "14d":
        return createdAt >= new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  };

  // Filter users by text and date
  const filteredUsers = users.filter((user) => {
    // date filter
    if (!filterByDateRange(user)) return false;

    // text filters (case-insensitive includes)
    for (const [key, val] of Object.entries(filters)) {
      if (key === "dateRange") continue; // skip dateRange key

      if (
        val &&
        !(
          user[key] &&
          user[key].toString().toLowerCase().includes(val.toLowerCase())
        )
      ) {
        return false;
      }
    }
    return true;
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/search");
      setUsers(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // update
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addedAmount, setAddedAmount] = useState("");

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setAddedAmount("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setAddedAmount("");
  };

  const handleConfirmAdd = async () => {
    if (!selectedUser || isNaN(Number(addedAmount))) return;

    const userType = selectedUser.userType;
    let updatedField;
    let updatedValue;

    if (userType === "special") {
      updatedField = "paidAmount";
      updatedValue = (selectedUser.paidAmount || 0) + Number(addedAmount);
    } else {
      updatedField = "amount";
      updatedValue = (selectedUser.amount || 0) + Number(addedAmount);
    }

    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${selectedUser._id}`,
        {
          [updatedField]: updatedValue,
        }
      );
      console.log(res.data);
      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id
            ? { ...u, [updatedField]: updatedValue }
            : u
        )
      );

      handleCloseDialog();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    return date.toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Enable AM/PM
    });
  };
  return (
    <div className="serach-container">
      <div className="inner-search-container">
        <h1 className="search-title">Search</h1>

        <div className="inner-search-box">
          <div className="inner-search-box-top">
            <select value={filters.dateRange} onChange={handleDateChange}>
              <option value="">Filter by Day</option>
              <option value="12h">12 Hours Ago</option>
              <option value="1d">1 Day Ago</option>
              <option value="7d">7 Days Ago</option>
              <option value="14d">14 Days Ago</option>
            </select>
          </div>

          <div className="inner-search-box-bottom">
            <div className="search-filter-box" style={{ marginTop: 10 }}>
              <input
                type="text"
                placeholder="Search by Name"
                value={filters.name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Search by Number"
                value={filters.number}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Search by Address"
                value={filters.address}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Search by Role"
                value={filters.role || filters.userType}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Search by Email"
                value={filters.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="search-filer-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Number</th>
                    <th>Address</th>
                    <th>Fix Amount</th>
                    <th>Due Amount</th>
                    <th>Paid</th>
                    <th>Add</th>
                    <th>Role</th>
                    <th>Delete</th>
                    {/* <th>Update</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr key={user._id}>
                      <td>{idx + 1}</td>
                      <td>{formatTimestamp(user.timestamp)}</td>
                      <td>{user?.name}</td>
                      <td>{user?.email}</td>
                      <td>{user?.number}</td>
                      <td>{user?.address}</td>
                      <td className="fix">{user?.fixedAmount || "-"}</td>
                      <td className="due">
                        {user?.fixedAmount
                          ? user?.fixedAmount - user?.paidAmount
                          : "-"}
                      </td>
                      <td className="paid">
                        {user?.paidAmount || user?.amount}
                      </td>
                      <td className="add-money">
                        <button
                          className="add-money"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <AddIcon />
                        </button>
                      </td>
                      <td>{user?.role || "General"}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(user?._id)}
                        >
                          Delete
                        </button>
                      </td>
                      {/* <td>
                        <button className="update-btn">Update</button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
                {/* Material UI Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle>Add Money</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      label="Amount"
                      type="number"
                      fullWidth
                      value={addedAmount}
                      onChange={(e) => setAddedAmount(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleConfirmAdd}>
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
