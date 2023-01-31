import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { ForfeitInterface } from "../models/IForfeit";

function Forfeit() {
  const [forfeit, setForfeit] = useState<ForfeitInterface[]>([]);

  const getForfeit = async () => {
    const apiUrl = "http://localhost:8080/forfeit";

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        "Content-Type": "application/json",
      },
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);

        if (res.data) {
          setForfeit(res.data);
        }
      });
  };
  
    const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 20 },
    {
        field: "UserName",
        headerName: "ชื่อผู้ยืมหนังสือ",
        width: 200,
        valueGetter: (params) => {
          return params.getValue(params.id, "ReturnBook").BorrowBook.User.Name;
        },
    },
    {
        field: "BookName",
        headerName: "ชื่อหนังสือ",
        width: 350,
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
        width: 200,
        valueGetter: (params) => {
          return params.getValue(params.id, "ReturnBook").Late_Number;
        },
    },
    { field: "Pay", headerName: "เงินค่าปรับ", width: 100 },
    {
      field: "PaymentName",
      headerName: "วิธีการชำระเงิน",
      width: 250,
      valueGetter: (params) => {
        return params.getValue(params.id, "Payment").Name;
      },
    },
    { field: "Note", headerName: "หมายเหตุ", width: 250 },
    {
      field: "Pay_Date",
      headerName: "วันที่และเวลา",
      width: 200,
      valueFormatter: (params) => format(new Date(params?.value), "P hh:mm a"),
    },
      {
        field: "LibrarianName",
        headerName: "บรรณารักษ์ผู้บันทึก",
        width: 200,
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
        <Container maxWidth="lg">
          <Box
            display="flex"
            sx={{
              marginTop: 2,
            }}
          >
            <Box flexGrow={1}>
              <Typography
                component="h1"
                variant="h6"
                color="primary"
                gutterBottom
              >
                ข้อมูลการบันทึกค่าปรับ
              </Typography>
            </Box>
  
            <Box>
              <Button
                component={RouterLink}
                to="/forfeit/create"
                variant="contained"
                color="primary"
              >
                บันทึกการบันทึกค่าปรับ
              </Button>
            </Box>
          </Box>
  
          <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
            <DataGrid
              rows={forfeit}
              getRowId={(row) => row.ID}
              columns={columns}
              pageSize={20}
              rowsPerPageOptions={[40]}
            />
          </div>
        </Container>
      </div>
    );
  }

export default Forfeit;