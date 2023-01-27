import { useEffect, useState } from "react";
import { BookPurchasingInterface } from "../models/IBookPurchasing";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { LibrarianInterface } from "../models/ILibrarian";

function BookPurchasing() {
  const [bookpurchasing, setBookPurchasing] = useState<
    BookPurchasingInterface[]
  >([]);

  const GetAllBookPurchasing = async () => {
    const apiUrl = "http://localhost:8080/bookPurchasing";

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
          setBookPurchasing(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 20 },
    {
      field: "BookName",
      headerName: "ชื่อหนังสือ",
      width: 215,
      editable: true,
    },
    {
      field: "BookCategoryName", //getValue ชื่อห้ามซ้ำกัน
      headerName: "ประเภทหนังสือ",
      width: 215,
      valueGetter: (params) => {
        return params.getValue(params.id, "BookCategory").Name;
      },
    },
    { field: "AuthorName", headerName: "ผู้แต่งหนังสือ", width: 215 },
    {
      field: "PublisherName",
      headerName: "สำนักพิมพ์",
      width: 215,
      valueGetter: (params) => {
        return params.getValue(params.id, "Publisher").Name;
      },
    },
    { field: "Amount", headerName: "จำนวน(เล่ม)", width: 150 },
    {
      field: "LibrarianName",
      headerName: "ผู้บันทึกข้อมูล",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "Librarian").Name;
      },
    },
    {
      field: "Date",
      headerName: "วันที่และเวลา",
      width: 170,
      valueFormatter: (params) => format(new Date(params?.value), "P hh:mm a"),
    },
  ];

  useEffect(() => {
    GetAllBookPurchasing();
  }, []);

  return (
    <div>
      <Container maxWidth="xl">
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
              รายการจัดซื้อหนังสือ
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/bookPurchasingCreate"
              variant="contained"
              color="primary"
            >
              สั่งซื้อหนังสือ
            </Button>
          </Box>
        </Box>

        <div style={{ height: 600, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={bookpurchasing}
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

export default BookPurchasing;
