import React from "react";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Tooltip,
  Pagination,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("🎉 Record Deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("❌ Failed to Delete user!");
    }
  };

  const handleEditOpen = (user) => setEditUser(user);
  const handleEditClose = () => setEditUser(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${editUser._id}`,
        editUser
      );
      setUsers((prev) =>
        prev.map((user) => (user._id === res.data._id ? res.data : user))
      );
      handleEditClose();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // due amount code

  const [selectedUser, setSelectedUser] = useState(null);

  const dueUsers = users.filter(
    (user) =>
      typeof user.fixedAmount === "number" &&
      typeof user.paidAmount === "number" &&
      user.fixedAmount > user.paidAmount
  );

  const handleView = (user) => {
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/fixed-users");
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" autoClose={2000} />
      <h1 className="dashboard-heading">Dashboard</h1>
      <div className="dashboard-container">
        {/* Left Side */}
        <div className="dashboard-left-side">
          <div className="wrapper-dashboard-left-side-top">
            {[
              ["Total Record", users.length],
              [
                "Total Deposit Amount",
                users.reduce((total, user) => {
                  return total + (user.paidAmount || user.amount || 0);
                }, 0),
              ],
              ["Total Collectors List", admins.length],
            ].map(([title, value], idx) => (
              <div key={idx} className="innter-dashboard-top-box">
                <div className="dashboard-top-info">
                  <h2>{title}</h2>
                  <p>{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="wrapper-dashboard-left-side-bottom">
            <h3>Record Table</h3>
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Number</th>
                    <th>Address</th>
                    <th>FixedAmount</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Role</th>
                    <th>Delete</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, idx) => (
                    <tr key={user._id}>
                      <td>{indexOfFirstUser + idx + 1}</td>
                      <td>
                        <Tooltip title={user.name}>
                          <span>{user.name?.slice(0, 4)}...</span>
                        </Tooltip>
                      </td>
                      <td>
                        <Tooltip title={user.number}>
                          <span>{user.number?.slice(0, 11)}...</span>
                        </Tooltip>
                      </td>
                      <td>
                        <Tooltip title={user.address || "-"}>
                          <span>{(user.address || "-").slice(0, 6)}...</span>
                        </Tooltip>
                      </td>
                      <td>{user.fixedAmount || "-"}</td>
                      <td>{user.paidAmount || user.amount || "-"}</td>
                      <td className="due-amount-color">
                        {user.fixedAmount - user.paidAmount || "-"}
                      </td>
                      <td>{user.role || "User"}</td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn-update"
                          onClick={() => handleEditOpen(user)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, page) => setCurrentPage(page)}
                  color="primary"
                />
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          <Dialog open={!!editUser} onClose={handleEditClose}>
            <DialogTitle>Update User</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    name="name"
                    value={editUser?.name || ""}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Number"
                    name="number"
                    value={editUser?.number || ""}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    value={editUser?.email || ""}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="address"
                    value={editUser?.address || ""}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Fixed Amount"
                    name="fixedAmount"
                    value={editUser?.fixedAmount || ""}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                {/* <Grid item xs={6}>
                  <TextField
                    label="Paid Amount"
                    name="paidAmount"
                    value={editUser?.paidAmount || ""}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid> */}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditClose} color="error">
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSubmit}
                variant="contained"
                color="success"
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/* Right Side */}
        <div className="dashboard-right-side">
          <div className="wrapper-dashboard-right">
            {/* <div className="due-amount">
              <h3>Due Amount User List</h3>
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Due Amount</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((id) => (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>Client {id}</td>
                        <td>{1000 - id * 100}</td>
                        <td>
                          <button className="btn-view">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div> */}
            <div className="due-amount">
              <h3>Due Amount User List</h3>
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th style={{textAlign:"center"}}>ID</th>
                      <th style={{textAlign:"center"}}>Name</th>
                      <th style={{textAlign:"center"}}>Due Amount</th>
                      <th style={{textAlign:"center"}}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dueUsers.map((user, idx) => (
                      <tr key={user._id || idx}>
                        <td>{idx + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.fixedAmount - user.paidAmount}</td>
                        <td>
                          <button
                            className="btn-view"
                            onClick={() => handleView(user)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal for View Details */}
              <Modal open={!!selectedUser} onClose={handleClose}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "white",
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                    width: 300,
                    textAlign: "center",
                  }}
                >
                  {selectedUser && (
                    <>
                      <h3 style={{ fontSize: "21px" }}>User Details</h3>
                      <p>
                        <strong>ID:</strong> {selectedUser._id}
                      </p>
                      <p>
                        <strong>Number:</strong> {selectedUser.number}
                      </p>
                      <p>
                        <strong>Paid Amount:</strong> {selectedUser.paidAmount}
                      </p>
                      <p>
                        <strong>Fixed Amount:</strong>{" "}
                        {selectedUser.fixedAmount}
                      </p>
                      <p>
                        <strong>Due:</strong>{" "}
                        {selectedUser.fixedAmount - selectedUser.paidAmount}
                      </p>
                    </>
                  )}
                </Box>
              </Modal>
            </div>

            {/* <div className="admin-list">
              <h3>Collector List</h3>
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Number</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((id) => (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>Admin {id}</td>
                        <td>Admin</td>
                        <td>example@gmail.com</td>
                        <td>1000</td>
                        <td>
                          <button className="btn-view">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div> */}

            <div className="admin-list">
              <h3>Total Collectors List: {admins.length}</h3>
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th style={{textAlign:"center"}}>ID</th>
                      <th style={{textAlign:"center"}}>Name</th>
                      <th style={{textAlign:"center"}}>Number</th>
                      <th style={{textAlign:"center"}}>Email</th>
                      <th style={{textAlign:"center"}}>Address</th>
                      <th style={{textAlign:"center"}}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin, idx) => (
                      <tr key={admin._id}>
                        <td>{idx + 1}</td>
                        <td>{admin.name}</td>
                        <td>{admin.number}</td>
                        <td>{admin.email}</td>
                        <td>{admin.address}</td>
                        <td>
                          <button
                            className="btn-view"
                            onClick={() => setSelectedAdmin(admin)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Modal
              open={!!selectedAdmin}
              onClose={() => setSelectedAdmin(null)}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "white",
                  p: 4,
                  borderRadius: 2,
                  boxShadow: 24,
                  width: 320,
                  textAlign: "left",
                }}
              >
                {selectedAdmin && (
                  <>
                    <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                      Collector Details
                    </h3>
                    <p>
                      <strong>ID:</strong> {selectedAdmin._id}
                    </p>
                    <p>
                      <strong>Name:</strong> {selectedAdmin.name}
                    </p>
                    <p>
                      <strong>Number:</strong> {selectedAdmin.number}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedAdmin.email}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedAdmin.address}
                    </p>
                  </>
                )}
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
