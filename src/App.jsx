import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AddNewRecord from "./components/AddNewRecord";
import Search from "./components/Search";
import AdminListPage from "./components/AdminListPage";
import NotFound from "./components/NotFound";
import TrashFile from "./components/TrashFile";
import DuePage from "./components/DuePage";
import FixedAmountPage from "./components/FixedAmountPage";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import IndividualSearch from "./components/IndividualSearch";
import ProtectedRoute from "./components/ProtectedRoute";
import MyAccount from "./components/MyAccount";
import MyHistoray from "./components/MyHistoray";
import DashBoardWelcomePage from "./components/DashBoardWelcomePage";
import AdminAppruval from "./components/AdminAppruval";
import FixedUserList from "./components/FixedUserList";

function App() {
  return (
    <>
      <div>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Home />}>
              <Route
                path="dashboardwelcome"
                element={<DashBoardWelcomePage />}
              />
              <Route path="myaccount" element={<MyAccount />} />
              <Route path="mycollection" element={<MyHistoray />} />
              <Route path="addnewrecord" element={<AddNewRecord />} />
              <Route path="search" element={<Search />} />
              <Route path="individualsearch" element={<IndividualSearch />} />
              <Route path="adminlist" element={<AdminListPage />} />
              <Route path="fixedamout" element={<FixedAmountPage />} />
              <Route path="fixeduserList" element={<FixedUserList />} />
              <Route path="approval" element={<AdminAppruval />} />
              <Route path="dashboardoverview" element={<Dashboard />} />
              <Route path="dueamount" element={<DuePage />} />
            </Route>

            <Route path="/trashfile" element={<TrashFile />} />
          </Route>

          {/* 404 fallback */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
