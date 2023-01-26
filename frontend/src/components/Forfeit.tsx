import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { ForfeitInterface } from "../models/IForfeit";

function Forfeit() {
  const [forfeit, setForfeit] = useState<ForfeitInterface[]>([]);
  const apiUrl = "http://localhost:8080";

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getForfeit = async () => {
    fetch(`${apiUrl}/forfeit`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log("forfeit", res.data);
        if (res.data) {
          setForfeit(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const columns: GridColDef[] = [
    {
        field: "UserName",
        headerName: "ชื่อผู้ยืมหนังสือ",
        width: 150,
        valueGetter: (params) => {
          return params.getValue(params.id, "ReturnBook").BorrowBook.User.Name;
        },
    },
    {
        field: "BookName",
        headerName: "ชื่อหนังสือ",
        width: 150,
        valueGetter: (params) => {
          return params.getValue(params.id, "ReturnBook").BorrowBook.BookPurchasing.BookName;
        },
    },
    {
        field: "LostBookName",
        headerName: "การทำหนังสือหาย",
        width: 150,
        valueGetter: (params) => {
          return params.getValue(params.id, "ReturnBook").LostBook.Name;
        },
    },
    {
        field: "LateNumber",
        headerName: "จำนวนวันที่เกินกำหนดการคืน",
        width: 150,
        valueGetter: (params) => {
          return params.getValue(params.id, "ReturnBook").Late_Number;
        },
    },
    { field: "Pay", headerName: "เงินค่าปรับ", width: 215 },
    { field: "Payment", headerName: "วิธีการชำระเงิน", width: 215 },
    { field: "Note", headerName: "วิธีการชำระเงิน", width: 215 },
    {
        field: "Pay_Date",
        headerName: "วันที่และเวลา",
        width: 170,
        valueFormatter: (params) => format(new Date(params?.value), "P hh:mm a"),
        // moment(params?.value).format("DD/MM/YYYY hh:mm A"),
      },
    {
      field: "Librarian",
      headerName: "ผู้แนะนำหนังสือ",
      width: 150,
      valueGetter: (params) => {
        return params.getValue(params.id, "Librarian").Name;
      },
    },
  ];

  useEffect(() => {
    getForfeit();
  }, []);

  return (
    <div>
      <Container maxWidth="md">
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              ข้อมูลการแนะนำหนังสือ
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/forfeit/create"
              variant="contained"
              color="primary"
            >
              บันทึกค่าปรับ
            </Button>
          </Box>
        </Box>
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={forfeit}
            getRowId={(row) => row.ID}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Container>
    </div>
  );
}

export default Forfeit;