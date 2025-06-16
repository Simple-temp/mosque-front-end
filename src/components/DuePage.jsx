import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const dummyData = [
  { id: 1, name: "User One", number: "01700000001", fixedAmount: 400, paidAmount: 200 },
  { id: 2, name: "User Two", number: "01700000002", fixedAmount: 400, paidAmount: 400 },
  { id: 3, name: "User Three", number: "01700000003", fixedAmount: 400, paidAmount: 300 },
  { id: 4, name: "User Four", number: "01700000004", fixedAmount: 400, paidAmount: 400 },
  { id: 5, name: "User Five", number: "01700000005", fixedAmount: 400, paidAmount: 100 },
];

const DuePage = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ color: "#00c853", marginBottom: 2 }}>
        Due Page
      </Typography>

      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Number</TableCell>
              <TableCell sx={{ backgroundColor: "#c8e6c9" }}>Paid Amount</TableCell>
              <TableCell sx={{ backgroundColor: "#ffcdd2" }}>Due Amount</TableCell>
              <TableCell sx={{ backgroundColor: "#bbdefb" }}>Send Message</TableCell>
              <TableCell sx={{ backgroundColor: "#ffcdd2" }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((user) => {
              const dueAmount = user.fixedAmount - user.paidAmount;
              const isDue = dueAmount > 0;

              return (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.number}</TableCell>
                  <TableCell sx={{ backgroundColor: "#e8f5e9" }}>${user.paidAmount}</TableCell>
                  <TableCell sx={{ backgroundColor: "#ffebee" }}>${dueAmount}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#64b5f6",
                        color: "white",
                        ":hover": { backgroundColor: "#42a5f5" },
                      }}
                      disabled={!isDue}
                    >
                      Send
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#e53935",
                        color: "white",
                        ":hover": { backgroundColor: "#c62828" },
                      }}
                      disabled={isDue}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default DuePage;
