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
    selectedDate: "", // ✅ Only this for date filter
  });

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

  const handleInputChange = (e) => {
    const { placeholder, value } = e.target;
    const key = placeholder.toLowerCase().split("by ")[1];
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredUsers = users.filter((user) => {
    const { selectedDate, ...textFilters } = filters;

    // ✅ Filter by selected date
    if (selectedDate) {
      const userDate = new Date(user.timestamp);
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      if (userDate < startOfDay || userDate > endOfDay) return false;
    }

    // ✅ Filter by text fields
    for (const [key, val] of Object.entries(textFilters)) {
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

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addedAmount, setAddedAmount] = useState("");

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
      console.log(res);

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
      hour12: true,
    });
  };

  return (
    <div className="serach-container">
      <div className="inner-search-container">
        <h1 className="search-title">Search</h1>

        <div className="inner-search-box">
          <div
            className="inner-search-box-top"
            style={{ display: "flex", gap: "10px", marginBottom: "15px" }}
          >
            <input
              type="date"
              value={filters.selectedDate}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  selectedDate: e.target.value,
                }))
              }
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            />
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
                    <th>Paid</th>
                    <th>Due Amount</th>
                    <th>Role</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, idx) => (
                    <tr key={user._id}>
                      <td>{indexOfFirstUser + idx + 1}</td>
                      <td>{formatTimestamp(user.timestamp)}</td>
                      <td>{user?.name}</td>
                      <td>{user?.email}</td>
                      <td>{user?.number}</td>
                      <td>{user?.address}</td>
                      <td className="fix">{user?.fixedAmount || "-"}</td>
                      <td className="paid">
                        {user?.paidAmount || user?.amount}
                      </td>
                      <td className="due">
                        {user?.fixedAmount
                          ? user?.fixedAmount - user?.paidAmount
                          : "-"}
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
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <span style={{ margin: "0 15px", alignSelf: "center" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outlined"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
