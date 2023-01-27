import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { LibrarianInterface } from "../models/ILibrarian";
import { BorrowBookInterface } from "../models/IBorrowBook";
import { ReturnBookInterface } from "../models/IReturnBook";
import { LostBookInterface } from "../models/ILostBook";


function ReturnBook() {
  const [returnbook, setReturnBook] = useState<ReturnBookInterface[]>([]);

  const getReturnBook = async () => {
    const apiUrl = "http://localhost:8080/return_books";

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
          setReturnBook(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 20 },
    {
      field: "ReturnBookName",
      headerName: "ชื่อผู้ที่เคยยืมหนังสือ",
      width: 120,
      valueGetter: (params) => {
        return params.getValue(params.id, "BorrowBook").User.Name;
      },
    },
    {
      field: "Idcard",
      headerName: "เลขบัตรประชาชน",
      width: 140,
      valueGetter: (params) => {
        return params.getValue(params.id, "BorrowBook").User.Idcard;
      },
    },
    {
      field: "Color_Bar",
      headerName: "เเถบสีหนังสือ",
      width: 150,
      valueGetter: (params) => {
        return params.getValue(params.id, "BorrowBook").Color_Bar;
      },
    },
    {
      field: "BookName",
      headerName: "ชื่อหนังสือ",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "BorrowBook").BookPurchasing.BookName;
      },
    },
    {
      field: "BookCategory",
      headerName: "หมวดหมู่หนังสือ",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "BorrowBook").BookPurchasing.BookCategory.Name;
      },
    },
    // {
    //   field: "Return_Day",
    //   headerName: "วันกำหนดคืน",
    //   width: 200,
    //   valueGetter: (params) => {
    //     return params.getValue(params.id, "BorrowBook").Return_Day;
    //   },
    // },
    {
      field: "Current_Day",
      headerName: "วันที่คืนหนังสือ",
      width: 200,
      valueFormatter: (params) => format(new Date(params?.value), "P hh:mm a"),
    },
    { 
      field: "Late_Number",
      headerName: "จำนวนวันเลยกำหนดคืน(วัน)",
      width: 200,
    },
    {
      field: "LostBookName",
      headerName: "หนังสือหาย(หาย/ไม่หาย)",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "LostBook").Name;
      },
    },
    { 
      field: "Book_Condition",
      headerName: "สภาพหนังสือ",
      width: 200,
    },
    {
      field: "LibrarianName",
      headerName: "บรรณารักษ์ผู้บันทึก",
      width: 150,
      valueGetter: (params) => {
        return params.getValue(params.id, "Librarian").Name;
      },
    },
  ];


  useEffect(() => {
    getReturnBook();

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
              รายการ-การคืนหนังสือของสมาชิกห้องสมุด
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/returnbook/create"
              variant="contained"
              color="primary"
            >
              บันทึกการคืนหนังสือ
            </Button>
          </Box>
        </Box>

        <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={returnbook}
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

export default ReturnBook;