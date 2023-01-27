import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";



import { format } from "date-fns";
import { PreorderInterface } from "../models/IPreorder";

function Preorder() {
    const [preorder, setPreorder] = useState<PreorderInterface[]>([]);

  const getPreorder = async () => {
    const apiUrl = "http://localhost:8080/preorder";    
    
	const requestOptions = {
      method: "GET", 
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json()) //แปลงข้อมูลที่ได้เป็น json

      .then((res) => {
        console.log(res.data);

        if (res.data) {
          setPreorder(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 50 },

    // เลขบัตรประจำตัวประชาชน+รายชื่อที่ได้จากการดึงข้อมูล
    {
      field: "OwnerID",
      headerName: "เลขบัตรประจำตัวประชาชน",
      width: 200,

      valueGetter: (params) => {
        return params.getValue(params.id, "User").Idcard;
      },
    },
	{
		field: "OwnerName",
		headerName: "ชื่อสมาชิก",
		width: 200,
  
		valueGetter: (params) => {
		  return params.getValue(params.id, "User").Name;
		},
	  },


    { field: "Name", headerName: "ชื่อหนังสือ", width: 150 },
    { field: "Price", headerName: "ราคา", width: 50 },
    { field: "Author", headerName: "ชื่อผู้แต่ง", width: 150 },
    { field: "Edition", headerName: "จำนวนครั้งที่พิมพ์", width: 150 },
    { field: "Year", headerName: "ปีที่พิมพ์", width: 100 },
    { field: "Quantity", headerName: "จำนวนเล่ม", width: 120 },
    { field: "Totalprice", headerName: "ราคาทั้งหมด", width: 120 },

    //--------
    //วิธีชำระเงิน
    {
      field: "Payment",
      headerName: "วิธีชำระเงิน",
      width: 100,
      valueGetter: (params) => {
        return params.getValue(params.id, "Payment").Name;
      },
    },

    //datetime
    {
      field: "Datetime",
      headerName: "วันเวลาที่ทำรายการ",
      width: 200,
      valueFormatter: (params) => format(new Date(params?.value), "dd-MM-yyyy"),
    },

    //ผู้บันทึกข้อมูล
    {
      field: "Libratian",
      headerName: "บรรณารักษ์",
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
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              ใบคำสั่งซื้อหนังสือ
            </Typography>
          </Box> 
          <Box>
            <Button
              component={RouterLink}
              to="/preorder/create"
              variant="contained"
              color="primary"
            >
              เพิ่มรายการคำสั่งซื้อหนังสือ
            </Button>
          </Box>
        </Box>
        <div style={{ height: 550, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={preorder}
            getRowId={(row) => row.ID}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20]}
          />
        </div>
      </Container>
    </div>
  );
}

export default Preorder;
