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
import { BookCategoryInterface } from "../models/IBookCategory";
import { BookPurchasingInterface } from "../models/IBookPurchasing";

function BorrowBook() {
  const [borrowbook, setBorrowBook] = useState<BorrowBookInterface[]>([]);

  const getBorrowBook = async () => {
    const apiUrl = "http://localhost:8080/borrow_books";

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
          setBorrowBook(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 20 },
    {
      field: "BorrowBookName",
      headerName: "ชื่อผู้ยืมหนังสือ",
      width: 120,
      valueGetter: (params) => {
        return params.getValue(params.id, "User").Name;
      },
    },
    {
      field: "Idcard",
      headerName: "เลขบัตรประชาชน",
      width: 140,
      valueGetter: (params) => {
        return params.getValue(params.id, "User").Idcard
      },
    },
    {
      field: "BookName",
      headerName: "ชื่อหนังสือ",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "BookPurchasing").BookName;
      },
    },
    {
      field: "BookCategory",
      headerName: "หมวดหมู่หนังสือ",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "BookPurchasing").BookCategory.Name;
      },
    },
    { 
      field: "Color_Bar", 
      headerName: "เเถบสีหนังสือ", 
      width: 110
    },
    { 
      field: "Borb_Frequency", 
      headerName: "จำนวนครั้งที่ยืมหนังสือ", 
      width: 150
    },
    {
      field: "Borb_Day",
      headerName: "วันที่ยืมหนังสือ",
      width: 200,
      valueFormatter: (params) => format(new Date(params?.value), "P hh:mm a"),
    },
    {
      field: "Return_Day",
      headerName: "วันกำหนดคืนหนังสือ",
      width: 200,
      valueFormatter: (params) => format(new Date(params?.value), "P hh:mm a"),
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
    getBorrowBook();

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
              รายการ-การยืมหนังสือของสมาชิกห้องสมุด
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/borrowbook/create"
              variant="contained"
              color="primary"
            >
              บันทึกการยืมหนังสือ
            </Button>
          </Box>
        </Box>

        <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={borrowbook}
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

export default BorrowBook;