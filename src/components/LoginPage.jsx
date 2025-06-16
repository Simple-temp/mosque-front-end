import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div>
      <div className="bg-container">
        <div className="inner-box">
          <div className="inner-box-size">
            <form action="">
              <input type="text" placeholder="Input your Name" />
              <Link to="/dashboard/dashboardoverview" style={{textDecoration:"none"}}>
                <button>Login</button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
