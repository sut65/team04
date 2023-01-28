import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { IntroduceInterface } from "../models/IIntroduce";

function Introduce() {
  const [introduce, setIntroduce] = useState<IntroduceInterface[]>([]);
  const getIntroduce = async () => {
    const apiUrl = "http://localhost:8080/introduce";

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
          setIntroduce(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 50 },
    { field: "Title", headerName: "ชื่อเรื่อง", width: 350 },
    { field: "Author", headerName: "ชื่อผู้แต่ง", width: 250 },
    { field: "ISBN", headerName: "ISBN", width: 150 },
    { field: "Edition", headerName: "ตีพิมพ์ครั้งที่", width: 100 },
    { field: "Pub_Name", headerName: "สำนักพิมพ์", width: 200 },
    { field: "Pub_Year", headerName: "ปีที่พิมพ์", width: 80 },
    {
      field: "BookTypeName",
      headerName: "ประเภท",
      width: 150,
      valueGetter: (params) => {
        return params.getValue(params.id, "BookType").Name;
      },
    },
    {
      field: "ObjectiveName",
      headerName: "วัตถุประสงค์",
      width: 150,
      valueGetter: (params) => {
        return params.getValue(params.id, "Objective").Name;
      },
    },
    {
      field: "I_Date",
      headerName: "วันที่แนะนำหนังสือ",
      width: 200,
      valueFormatter: (params) => format(new Date(params?.value), "P hh:mm a"),
    },
    {
      field: "UserName",
      headerName: "ผู้แนะนำหนังสือ",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "User").Name;
      },
    },
  ];

  useEffect(() => {
    getIntroduce();
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
              to="/introduce/create"
              variant="contained"
              color="primary"
            >
              แนะนำหนังสือ
            </Button>
          </Box>
        </Box>
        <div style={{ height: 600, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={introduce}
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

export default Introduce;