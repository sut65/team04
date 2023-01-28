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
import { PreorderInterface } from "../models/IPreorder";

function Preorder() {
  const [preorder, setPreorder] = useState<PreorderInterface[]>([]);

  const getPreorder = async () => {
    const apiUrl = "http://localhost:8080/preorder";

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
          setPreorder(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 20 },
    {
      field: "UserID",
      headerName: "เลขบัตรประชาชน",
      width: 120,
      valueGetter: (params) => {
        return params.getValue(params.id, "User").Idcard;
      },
    },
    {
      field: "UserName",
      headerName: "ชื่อสมาชิก",
      width: 140,
      valueGetter: (params) => {
        return params.getValue(params.id, "User").Name
      },
    },

    {field: "Name",headerName: "ชื่อหนังสือ", width: 140,},
    {field: "Quantity",headerName: "จำนวน", width: 80,},
    {field: "Price",headerName: "ราคา", width: 50,},
    {field: "Totalprice",headerName: "ราคารวม", width: 100,},

    {field: "Author",headerName: "ผู้แต่ง", width: 100,},
    {field: "Edition",headerName: "พิมพ์ครั้งที่", width: 100,},
    {field: "Year",headerName: "ปีที่พิมพ์", width: 100,},

    {
      field: "Datetime",
      headerName: "วันเวลาที่ทำรายการ",
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
    getPreorder();

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
              ระบบ สั่งซื้อหนังสือ
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/preorder/create"
              variant="contained"
              color="primary"
            >
              บันทึกรายการใบคำสั่งซื้อ
            </Button>
          </Box>
        </Box>

        <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={preorder}
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

export default Preorder;