import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";

const AddNewRecord = () => {
  const [userType, setUserType] = useState("");
  const [specialRole, setSpecialRole] = useState("");

  const greenOutline = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#00c853",
      },
      "&:hover fieldset": {
        borderColor: "#00c853",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#00c853",
      },
    },
  };

  const renderCommonFields = () => (
    <>
      <Grid item xs={12} md={4}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          sx={greenOutline}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          sx={greenOutline}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Number"
          variant="outlined"
          fullWidth
          sx={greenOutline}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          sx={greenOutline}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          sx={greenOutline}
        />
      </Grid>
    </>
  );

  return (
    <div>
      <div className="add-new-record-container">
        <h1 style={{ color: "#00c853", fontSize: "22px" }}>Add new record</h1>
        <div className="inner-record-container">
          <div className="record-form">
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Grid container spacing={2}>
                {/* User Type */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <Select
                      label="User Type"
                      value={userType}
                      onChange={(e) => {
                        setUserType(e.target.value);
                        setSpecialRole("");
                      }}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Please select a user type
                      </MenuItem>
                      <MenuItem value="normal">Normal User</MenuItem>
                      <MenuItem value="special">Special User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Normal User Fields */}
                {userType === "normal" && renderCommonFields()}

                {/* Special User Role + All Fields */}
                {userType === "special" && (
                  <>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth variant="outlined">
                        <Select
                          label="Special User Role"
                          value={specialRole}
                          onChange={(e) => setSpecialRole(e.target.value)}
                        >
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="vip">VIP</MenuItem>
                          <MenuItem value="manager">Manager</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {specialRole && (
                      <>
                        {renderCommonFields()}
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Fix Amount"
                            variant="outlined"
                            fullWidth
                            sx={greenOutline}
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}
              </Grid>

              {/* Submit Button */}
              {(userType === "normal" ||
                (userType === "special" && specialRole)) && (
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    className="custom-submit-btn"
                  >
                    Submit
                  </Button>
                </Box>
              )}
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewRecord;
