import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { IntroduceInterface } from "../../models/IIntroduce";

function Introduce() {
  const [introduce, setIntroduce] = useState<IntroduceInterface[]>([]);
  const apiUrl = "http://localhost:8080";

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getIntroduce = async () => {
    fetch(`${apiUrl}/introduce/:id`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log("introduce", res.data);
        if (res.data) {
          setIntroduce(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 50 },
    { field: "Title", headerName: "ชื่อเรื่อง", width: 215 },
    { field: "Author", headerName: "ชื่อผู้แต่ง", width: 215 },
    { field: "ISBN", headerName: "ISBN", width: 215 },
    { field: "Edition", headerName: "ตีพิมพ์ครั้งที่", width: 215 },
    { field: "Pub_Name", headerName: "สำนักพิมพ์", width: 215 },
    { field: "Pub_Year", headerName: "ปีที่พิมพ์", width: 215 },
    {
      field: "BookType",
      headerName: "ประเภท",
      width: 80,
      valueGetter: (params) => {
        return params.getValue(params.id, "BookType").Name;
      },
    },
    {
      field: "Objective",
      headerName: "วัตถุประสงค์",
      width: 150,
      valueGetter: (params) => {
        return params.getValue(params.id, "Objective").Name;
      },
    },
    // {
    //   field: "I_Date",
    //   headerName: "วันที่",
    //   width: 100,
    //   valueFormatter: (params) => format(new Date(params?.value), "dd/MM/yyyy"),
    // },
    {
        field: "I_Date",
        headerName: "วันที่และเวลา",
        width: 170,
        valueFormatter: (params) => format(new Date(params?.value), "P hh:mm a"),
        // moment(params?.value).format("DD/MM/YYYY hh:mm A"),
      },
    {
      field: "User",
      headerName: "ผู้แนะนำหนังสือ",
      width: 150,
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
      <Container maxWidth="md">
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
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={introduce}
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

export default Introduce;