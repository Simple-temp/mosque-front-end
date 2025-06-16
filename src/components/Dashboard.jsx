import React from "react";
import "./Dashboard.css"

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-heading">Dashboard</h1>
      <div className="dashboard-container">
        {/* Left Side */}
        <div className="dashboard-left-side">
          <div className="wrapper-dashboard-left-side-top">
            {[["Total Record", 50], ["Total Deposit Amount", 50], ["Total Admin List", 50]].map(
              ([title, value], idx) => (
                <div key={idx} className="innter-dashboard-top-box">
                  <div className="dashboard-top-info">
                    <h2>{title}</h2>
                    <p>{value}</p>
                  </div>
                </div>
              )
            )}
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
                    <th>Actual Amount</th>
                    <th>Paid</th>
                    <th>Role</th>
                    <th>Delete</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5,6].map(id => (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>User {id}</td>
                      <td>012345678{id}</td>
                      <td>Address {id}</td>
                      <td>1000</td>
                      <td>800</td>
                      <td>User</td>
                      <td><button className="btn-delete">Delete</button></td>
                      <td><button className="btn-update">Update</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="dashboard-right-side">
          <div className="wrapper-dashboard-right">
            <div className="due-amount">
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
                    {[1, 2, 3].map(id => (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>Client {id}</td>
                        <td>{1000 - id * 100}</td>
                        <td><button className="btn-view">View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-list">
              <h3>Admin List</h3>
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Paid</th>
                      <th>Fix Amount</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map(id => (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>Admin {id}</td>
                        <td>Admin</td>
                        <td>{id * 100}</td>
                        <td>1000</td>
                        <td><button className="btn-view">View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
