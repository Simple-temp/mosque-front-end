import React from "react";


const Search = () => {
  return (
    <div className="serach-container">
      <div className="inner-search-container">
        <h1 className="search-title">Search</h1>

        <div className="inner-search-box">
          <div className="inner-search-box-top">
            <select>
              <option value="">Filter by Day</option>
              <option value="">12 Hours Ago</option>
              <option value="">1 Day Ago</option>
              <option value="">7 Days Ago</option>
              <option value="">14 Days Ago</option>
            </select>
          </div>

          <div className="inner-search-box-bottom">
            <div className="search-filter-box">
              <input type="text" placeholder="Search by Name" />
              <input type="text" placeholder="Search by Number" />
              <input type="text" placeholder="Search by Address" />
              <input type="text" placeholder="Search by Role" />
              <input type="text" placeholder="Search by Email" />
            </div>

            <div className="search-filer-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Number</th>
                    <th>Address</th>
                    <th>Fix Amount</th>
                    <th>Due Amount</th>
                    <th>Actual Amount</th>
                    <th>Paid</th>
                    <th>Role</th>
                    <th>Delete</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01</td>
                    <td>John</td>
                    <td>john@example.com</td>
                    <td>01712345678</td>
                    <td>Dhaka</td>
                    <td className="fix">500</td>
                    <td className="due">200</td>
                    <td>700</td>
                    <td className="paid">500</td>
                    <td>Admin</td>
                    <td><button className="delete-btn">Delete</button></td>
                    <td><button className="update-btn">Update</button></td>
                  </tr>
                  <tr>
                    <td>02</td>
                    <td>Sarah</td>
                    <td>sarah@example.com</td>
                    <td>01812345678</td>
                    <td>Chattogram</td>
                    <td className="fix">300</td>
                    <td className="due">0</td>
                    <td>300</td>
                    <td className="paid">300</td>
                    <td>User</td>
                    <td><button className="delete-btn">Delete</button></td>
                    <td><button className="update-btn">Update</button></td>
                  </tr>
                  <tr>
                    <td>03</td>
                    <td>Ali</td>
                    <td>ali@example.com</td>
                    <td>01612345678</td>
                    <td>Sylhet</td>
                    <td className="fix">800</td>
                    <td className="due">400</td>
                    <td>1200</td>
                    <td className="paid">800</td>
                    <td>Editor</td>
                    <td><button className="delete-btn">Delete</button></td>
                    <td><button className="update-btn">Update</button></td>
                  </tr>
                  <tr>
                    <td>04</td>
                    <td>Rina</td>
                    <td>rina@example.com</td>
                    <td>01512345678</td>
                    <td>Barisal</td>
                    <td className="fix">450</td>
                    <td className="due">0</td>
                    <td>450</td>
                    <td className="paid">450</td>
                    <td>User</td>
                    <td><button className="delete-btn">Delete</button></td>
                    <td><button className="update-btn">Update</button></td>
                  </tr>
                  <tr>
                    <td>05</td>
                    <td>Hasan</td>
                    <td>hasan@example.com</td>
                    <td>01912345678</td>
                    <td>Khulna</td>
                    <td className="fix">600</td>
                    <td className="due">100</td>
                    <td>700</td>
                    <td className="paid">600</td>
                    <td>Admin</td>
                    <td><button className="delete-btn">Delete</button></td>
                    <td><button className="update-btn">Update</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
