import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import YoutubeSearchedForIcon from "@mui/icons-material/YoutubeSearchedFor";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import LogoutIcon from "@mui/icons-material/Logout";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="home-container">
      {/* Hamburger for small screen */}
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <div className={`left-part ${sidebarOpen ? "open" : ""}`}>
        <ul className="sidebar-menu">
          <li>
            <Link to="dashboardoverview" onClick={() => setSidebarOpen(false)}>
              <DashboardIcon /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="addnewrecord" onClick={() => setSidebarOpen(false)}>
              <AddCircleIcon /> Add New Record
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
          <li>
            <Link to="adminlist" onClick={() => setSidebarOpen(false)}>
              <AdminPanelSettingsIcon /> Admin List
            </Link>
          </li>
          <li>
            <Link to="fixedamout" onClick={() => setSidebarOpen(false)}>
              <AssignmentIndIcon /> Fixed Collectors User
            </Link>
          </li>
          <li>
            <Link to="dueamount" onClick={() => setSidebarOpen(false)}>
              <GroupRemoveIcon /> Due Amount
            </Link>
          </li>
          <li
            style={{ cursor: "pointer" }}
            onClick={() => setSidebarOpen(false)}
          >
            <Link to="/" onClick={() => setSidebarOpen(false)}>
              <LogoutIcon /> Logout
            </Link>
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
