import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import AddTaskIcon from "@mui/icons-material/AddTask";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("adminUser"));
    if (user?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="home-container">
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <div className={`left-part ${sidebarOpen ? "open" : ""}`}>
        <ul className="sidebar-menu">
          <li>
            <Link to="myaccount" onClick={() => setSidebarOpen(false)}>
              <AccountCircleIcon /> My Account
            </Link>
          </li>
          <li>
            <Link to="mycollection" onClick={() => setSidebarOpen(false)}>
              <WorkHistoryIcon /> My Collection
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <Link
                  to="dashboardoverview"
                  onClick={() => setSidebarOpen(false)}
                >
                  <DashboardIcon /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="adminlist" onClick={() => setSidebarOpen(false)}>
                  <AdminPanelSettingsIcon /> Admin List
                </Link>
              </li>
              <li>
                <Link to="dueamount" onClick={() => setSidebarOpen(false)}>
                  <GroupRemoveIcon /> Due Amount
                </Link>
              </li>
              <li>
                <Link to="approval" onClick={() => setSidebarOpen(false)}> 
                  <AddTaskIcon /> Approval list
                </Link>
              </li>
              <li>
                <Link to="fixeduserList" onClick={() => setSidebarOpen(false)}>
                  <AddCircleIcon /> Fixed User
                </Link>
              </li>
            </>
          )}
          <li>
            <Link to="addnewrecord" onClick={() => setSidebarOpen(false)}>
              <AddCircleIcon /> Doner
            </Link>
          </li>
          <li>
            <Link to="fixedamout" onClick={() => setSidebarOpen(false)}>
              <AssignmentIndIcon /> Collectors
            </Link>
          </li>
          <li>
            <Link to="search" onClick={() => setSidebarOpen(false)}>
              <YoutubeSearchedForIcon /> Search
            </Link>
          </li>
          <li>
            <Link to="individualsearch" onClick={() => setSidebarOpen(false)}>
              <YoutubeSearchedForIcon /> Individual Search
            </Link>
          </li>
          <li style={{ cursor: "pointer" }}>
            <span onClick={handleLogout}>
              <LogoutIcon /> Logout
            </span>
          </li>
        </ul>
      </div>

      <div className="right-part">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
