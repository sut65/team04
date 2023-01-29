import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";

import { ConfirmationInterface } from "../models/IConfirmation";

function Confirmation() {
  const [confirmation, setConfirmation] = useState<ConfirmationInterface[]>([]);

  const getConfirmation = async () => {
    const apiUrl = "http://localhost:8080/confirmation";

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
          setConfirmation(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 20 },
    {
      field: "PreorderID",
      headerName: "เลขรายการสั่งซื้อ",
      width: 120,
      valueGetter: (params) => {
        return params.getValue(params.id, "Preorder").ID;
      },
    },
    {
        field: "PreorderName",
        headerName: "ชื่อหนังสือ",
        width: 120,
        valueGetter: (params) => {
          return params.getValue(params.id, "Preorder").Name;
        },
      },    
    {
      field: "ReceiverID",
      headerName: "วิธีการรับ",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "Receiver").Type;
      },
    },
    {
      field: "NoteName",
      headerName: "หมายเหตุชื่อผู้รับ",
      width: 200,
    },
    { 
      field: "NoteTel", 
      headerName: "หมายเหตุเบอร์ผู้รับ", 
      width: 110,
    },
    
    {
      field: "Datetime",
      headerName: "วันเวลาที่รับหนังสือ",
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
    getConfirmation();

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
              ระบบยืนยันการรับหนังสือ
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/confirmation/create"
              variant="contained"
              color="primary"
            >
              บันทึกการยืนยันการรับหนังสือ
            </Button>
          </Box>
        </Box>

        <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={confirmation}
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

export default Confirmation;