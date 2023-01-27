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

function EquipmentPurchasing() {
  const [equipmentPurchasing, setEquipmentPurchasing] = useState<
    BookPurchasingInterface[]
  >([]);

  const GetAllEquipmentPurchasing = async () => {
    const apiUrl = "http://localhost:8080/equipmentPurchasing";

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
          setEquipmentPurchasing(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 20 },
    { field: "EquipmentName", headerName: "ชื่ออุปกรณ์", width: 250 },
    {
      field: "EquipmentCategoryName",
      headerName: "ประเภทอุปกรณ์",
      width: 215,
      valueGetter: (params) => {
        return params.getValue(params.id, "EquipmentCategory").Name;
      },
    },
    {
      field: "CompanyName",
      headerName: "บริษัท",
      width: 250,
      valueGetter: (params) => {
        return params.getValue(params.id, "Company").Name;
      },
    },
    { field: "Amount", headerName: "จำนวน (หน่วย)", width: 150 },
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
      width: 160,
      valueFormatter: (params) => format(new Date(params?.value), "P hh:mm a"),
    },
  ];

  useEffect(() => {
    GetAllEquipmentPurchasing();
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
              รายการจัดซื้ออุปกรณ์
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/equipmentPurchasingCreate"
              variant="contained"
              color="primary"
            >
              สั่งซื้ออุปกรณ์
            </Button>
          </Box>
        </Box>

        <div style={{ height: 600, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={equipmentPurchasing}
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

export default EquipmentPurchasing;
