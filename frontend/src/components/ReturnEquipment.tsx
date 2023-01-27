import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
// import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { BorrowEquipmentInterface } from "../models/IBorrowEquipment";
import { DataGrid, GridColDef,GridRowsProp, GridRenderCellParams } from "@mui/x-data-grid";
import { UserInterface } from "../models/IUser";
import { ReturnEquipmentInterface } from "../models/IReturnEquipment";
import { EquipmentStatusInterface } from "../models/IEquipmentStatus";



function ReturnEquipment(): JSX.Element {
  const [returnequipment, setReturnEquipment] = useState<ReturnEquipmentInterface[]>([]);

  const getReturnEquipment = async () => {
    const apiUrl = "http://localhost:8080/returnEquipment";

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
            setReturnEquipment(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", 
      headerName: "ลำดับ", 
      align: "center",
      headerAlign: "center",
      width: 20 
    },

    {
      field: "ReturnEquipmentName",
      headerName: "ชื่อผู้ที่เคยยืมอุปกรณ์",
      align: "center",
      headerAlign: "center",
      width: 180,
      valueGetter: (params) => {
        return params.getValue(params.id, "BorrowEquipment").User.Name;
      },
    },
    {
      field: "EquipmentName",
      headerName: "รายการอุปกรณ์",
      align: "center",
      headerAlign: "center",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "BorrowEquipment").EquipmentPurchasing.EquipmentName;
      },
    },
    // {
    //   field: "Return_Day",
    //   headerName: "วันกำหนดคืน",
    //   width: 200,
    //   valueGetter: (params) => {
    //     return params.getValue(params.id, "BorrowEquipment").Return_Day;
    //   },
    // },


    {
      field: "EquipmentStatusName",
      headerName: "สภาพอุปกรณ์",
      align: "center",
      headerAlign: "center",
      width: 100,
      valueGetter: (params) => {
        return params.getValue(params.id, "EquipmentStatus").Name;
      },
    },
    { 
      field: "Return_Detail", 
      headerName: "รายละเอียดเพิ่มเติม", 
      align: "center",
      headerAlign: "center",
      width: 150,
    },
    {
      field: "Return_Day",
      headerName: "วัน  เวลา ที่คืนอุปกรณ์",
      align: "center",
      headerAlign: "center",
      width: 180,
      valueFormatter: (params) => format(new Date(params?.value), "P hh:mm a"),
    },

    {
      field: "LibrarianName",
      headerName: "บรรณารักษ์ผู้บันทึก",
      align: "center",
      headerAlign: "center",
      width: 150,
      valueGetter: (params) => {
        return params.getValue(params.id, "Librarian").Name;
      },
    },

    // {
    //   field: "Librarian.Name",
    //   headerName: "บรรณารักษ์ผู้บันทึก",
    //   width: 130,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params: GridRenderCellParams<any>) => {
    //     return <>{params.row.Librarian.Name}</>;
    //   },
    // },

    // { field: "Update", 
    //   headerName: "บรรณารักษ์ผู้บันทึก",
    //   align: "center",
    //   headerAlign: "center",
    //   width: 100,
    //   valueGetter: (params) => {
    //     return params.getValue(params.id, "EquipmentPurchasing").EquipmentName;
    //   },
    // },

    // { field: "Delete", 
    //   headerName: "บรรณารักษ์ผู้บันทึก",
    //   align: "center",
    //   headerAlign: "center",
    //   width: 100 ,
    //   valueGetter: (params) => {
    //     return params.getValue(params.id, "EquipmentPurchasing").EquipmentName;
    //   },
    // },
  ];


  useEffect(() => {
    getReturnEquipment();
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
              ประวัติการคืนอุปกรณ์ทั้งหมด
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/returnequipment/create"
              variant="contained"
              color="primary"
            >
              บันทึกการคืนอุปกรณ์
            </Button>
          </Box>
        </Box>

        <div style={{ height: 600, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={returnequipment}
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

export default ReturnEquipment;