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
import { toast, ToastContainer } from "react-toastify";

const IndividualSearch = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ number: "" });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [addedAmount, setAddedAmount] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFilters({ number: value });

    if (value.trim() === "") {
      setFilteredUsers([]);
      fetchUsers();
    } else {
      const matched = users.filter((u) =>
        u.number?.toString().includes(value.trim())
      );
      setFilteredUsers(matched);
      fetchUsers();
    }
  };

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      const updated = users.filter((u) => u._id !== id);
      setUsers(updated);
      setFilteredUsers(
        updated.filter((u) => u.number?.toString().includes(filters.number))
      );
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleOpenDialog = () => {
    setAddedAmount("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAddedAmount("");
  };

  const handleConfirmAdd = async () => {
    let amountLeft = Number(addedAmount);
    if (isNaN(amountLeft) || amountLeft <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const updatedUsers = [...filteredUsers];
    let anyUpdate = false;

    for (let user of updatedUsers) {
      const due =
        (user.fixedAmount || 0) - (user.paidAmount || user.amount || 0);
      if (due <= 0) continue;

      const deduct = Math.min(due, amountLeft);
      const newPaid = (user.paidAmount || user.amount || 0) + deduct;

      try {
        await axios.put(`http://localhost:3000/api/users/${user._id}`, {
          [user.userType === "special" ? "paidAmount" : "amount"]: newPaid,
        });

        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id
              ? {
                  ...u,
                  [user.userType === "special" ? "paidAmount" : "amount"]:
                    newPaid,
                }
              : u
          )
        );

        amountLeft -= deduct;
        anyUpdate = true;
        if (amountLeft <= 0) break;
      } catch (error) {
        console.error("Add money error:", error);
        toast.error("Error updating user amount");
      }
    }

    if (anyUpdate) {
      toast.success("Amount successfully distributed. Please search again.");
    } else {
      toast.info("No due found to add money.");
    }

    await fetchUsers();
    handleCloseDialog();
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

  const totalDue = filteredUsers.reduce((sum, user) => {
    const due = (user.fixedAmount || 0) - (user.paidAmount || user.amount || 0);
    return sum + (due > 0 ? due : 0);
  }, 0);

  return (
    <div>
      <div className="individual-search-container">
        <h1 style={{ fontSize: "21px", color: "#00c853" }}>
          Individual Search
        </h1>
        <ToastContainer position="top-right" autoClose={2000} />

        <div className="search-filter-box" style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Search by Number"
            value={filters.number}
            onChange={handleInputChange}
          />
        </div>

        {filteredUsers.length === 0 ? (
          <p style={{ marginTop: "20px" }}>🔍 Please search by number.</p>
        ) : (
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
                {filteredUsers.map((user, idx) => {
                  const paid = user?.paidAmount || user?.amount || 0;
                  const due = (user?.fixedAmount || 0) - paid;
                  return (
                    <tr key={user._id}>
                      <td>{idx + 1}</td>
                      <td>{formatTimestamp(user.timestamp)}</td>
                      <td>{user?.name}</td>
                      <td>{user?.email}</td>
                      <td>{user?.number}</td>
                      <td>{user?.address}</td>
                      <td className="fix">{user?.fixedAmount || "-"}</td>
                      <td className="paid">{paid}</td>
                      <td className="due">{due > 0 ? due : 0}</td>
                      <td>{user?.role || "General"}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* Total Due Row */}
                <tr style={{ fontWeight: "bold", background: "#f0f0f0" }}>
                  <td colSpan="8">Total Due:</td>
                  <td style={{ color: "red" }}>{totalDue}</td>
                  <td>
                    <button onClick={handleOpenDialog}>
                      <AddIcon />
                    </button>
                  </td>
                  <td colSpan="2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog */}
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
  );
};

export default IndividualSearch;
