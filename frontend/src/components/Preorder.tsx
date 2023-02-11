import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { PreorderInterface } from "../models/IPreorder";

import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import DialogTitle from "@mui/material/DialogTitle";
import EditPreorder from "./PreorderEdit";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Preorder() {
  const [preorder, setPreorder] = useState<PreorderInterface[]>([]);

  const [opendelete, setOpenDelete] = useState(false);
  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  
  const [openedit, setOpenEdit] = useState(false);
  const [selectcellData, setSelectcellData] = useState<PreorderInterface>();

  const handleCellFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget.parentElement;
      const id = row!.dataset.id!;
      const pr = preorder.filter((v) => Number(v.ID) == Number(id));
      console.log(pr[0]);
      setSelectcellData(pr[0]);
    },
    [preorder]
  );

  const handleClose = (
    event?: React.SyntheticEvent | Event,

    reason?: string
  ) => {
    console.log(reason);
    if (reason === "clickaway") {
      return;
    }

    setSuccess(false);

    setError(false);
  };
  const handleClickDelete = () => {
    // setSelectCell(selectcell);
    DeletePreorder(Number(selectcellData?.ID));
    setOpenDelete(false);
  };
  const handleDelete = () => {
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleEdit = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };


  const DeletePreorder = async (id: Number) => {
    const apiUrl = `http://localhost:8080/preorder/${id}`;
    const requestOptions = {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        "Content-Type": "application/json",
      },
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        if (res.data) {
          setSuccess(true);
          window.location.reload();
        } else {
          setError(true);
        }
      });
  };
  
  //-----------

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
      headerName: "เลขบัตรประจำตัวประชาชน",
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
    {field: "Quantity",headerName: "จำนวนเล่ม", width: 80,},
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
      headerName: "ผู้บันทึกข้อมูล",
      width: 150,
      valueGetter: (params) => {
        return params.getValue(params.id, "Librarian").Name;
      },
    },
    {
      field: "Edit",
      headerName: "แก้ไขข้อมูล",
      align: "center",
      headerAlign: "center",
      width: 120,
      renderCell: () => (
        <div>
            &nbsp;
          <Button 
            onClick={handleEdit}
            variant="contained" 
            size="small" 
            startIcon={<EditIcon />}
            color="warning"
          > 
              แก้ไขข้อมูล
          </Button>
        </div>
      ),
    },
    {
      field: "Delete",
      headerName: "ลบข้อมูล",
      align: "center",
      headerAlign: "center",
      width: 120,
      renderCell: () => (
        <div>
          <Button
            onClick={handleDelete}
            variant="contained"
            size="small"
            startIcon={<DeleteIcon />}
            color="error"
          >
              ลบข้อมูล 
          </Button>
        </div>
      ),
    },
  ];


  useEffect(() => {
    getPreorder();

  }, []);

  return (
    <div>
      <Container maxWidth="lg">
      <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="success">
            ลบข้อมูลสำเร็จ
          </Alert>
        </Snackbar>

        <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            ลบข้อมูลไม่สำเร็จ
          </Alert>
        </Snackbar>

        <Dialog
          open={opendelete}
          onClose={handleDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"คุณต้องการลบข้อมูลใช่หรือไม่?"}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleDeleteClose}>
              ยกเลิก
            </Button>
            <Button onClick={handleClickDelete} autoFocus>
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openedit}
          onClose={handleEditClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogActions>
            <EditPreorder
              Cancle={handleEditClose}
              Data={selectcellData}
            />
          </DialogActions>
        </Dialog>

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
            componentsProps={{
              cell: {
                onFocus: handleCellFocus,
              },
            }}
            rowsPerPageOptions={[40]}
          />
        </div>
      </Container>
    </div>
  );
}

export default Preorder;