import React, { useState, useEffect, useCallback } from "react";
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
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Icon ลบ
import EditIcon from "@mui/icons-material/Edit";     // Icon เเก้ไข
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditBorrowEquipment from "./BorrowEquipmentEdit";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function BorrowEquipment() {
  const [borrowequipment, setBorrowEquipment] = useState<BorrowEquipmentInterface[]>([]);
  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [opendelete, setOpenDelete] = useState(false);
  const [openedit, setOpenEdit] = useState(false);

  const [selectcellData, setSelectcellData] = useState<BorrowEquipmentInterface>();

  const handleCellFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget.parentElement;
      const id = row!.dataset.id!;
      const b = borrowequipment.filter((v) => Number(v.ID) == Number(id));
      console.log(b[0]);
      setSelectcellData(b[0]);
    },
    [borrowequipment]
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
      // selectcellData(selectcellData);
      DeleteBorrowEquipment(Number(selectcellData?.ID));
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

  const DeleteBorrowEquipment = async (id: Number) => {
    const apiUrl = `http://localhost:8080/borrowEquipment/${id}`;
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
        //ตรงนี้คือลบในดาต้าเบสสำเร็จแล้ว
        if (res.data) {
        setSuccess(true);
        const remove = borrowequipment.filter(
          //กรองเอาข้อมูลที่ไม่ได้ลบ
          (perv) => perv.ID !== selectcellData?.ID
        );
          setBorrowEquipment(remove);
        } else {
          setError(true);
        }
      });
  };



  const GetAllBorrowEquipment = async () => {
    const apiUrl = "http://localhost:8080/borrowEquipment";

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
          setBorrowEquipment(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", 
      headerName: "ลำดับ", 
      align: "center",
      headerAlign: "center",
      width: 70 
    },

    {
      field: "UserName",
      headerName: "ชื่อ-นามสกุล ผู้ยืมอุปกรณ์",
      align: "center",
      headerAlign: "center",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "User").Name;
      },
    },

    {
      field: "EquipmentName",
      headerName: "รายการอุปกรณ์",
      align: "center",
      headerAlign: "center",
      width: 250,
      valueGetter: (params) => {
        return params.getValue(params.id, "EquipmentPurchasing").EquipmentName;
      },
    },
    { 
      field: "Amount_BorrowEquipment", 
      headerName: "จำนวนอุปกรณ์ที่ยืม(ชิ้น)", 
      align: "center",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "BorrowEquipment_Day",
      headerName: "วันที่และเวลา ที่ยืมอุปกรณ์",
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

    {
      field: "Edit",
      headerName: "Edit",
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
              Edit
          </Button>
        </div>
      ),
    },
    {
      field: "Delete",
      headerName: "Delete",
      align: "center",
      headerAlign: "center",
      width: 120,
      renderCell: () => (
        <div>
          <Button
            onClick={handleDelete}
            variant="contained"
            size="small"
            startIcon={<DeleteForeverOutlinedIcon />}
            color="error"
          >
              Delete 
          </Button>
        </div>
      ),
    },

  ];


  useEffect(() => {
    GetAllBorrowEquipment();
  }, []);

  return (
    <div>
      <Container maxWidth="xl">
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

        <Snackbar 
          open={error} 
          autoHideDuration={6000} 
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}

          >
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
            <EditBorrowEquipment
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
              ประวัติการยืมอุปกรณ์ทั้งหมด
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/borrowequipment/create"
              variant="contained"
              color="primary"
            >
              บันทึกการยืมอุปกรณ์
            </Button>
          </Box>
        </Box>

        <div style={{ height: 600, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={borrowequipment}
            getRowId={(row) => row.ID}
            columns={columns}
            pageSize={15}
            componentsProps={{
              cell: {
                onFocus: handleCellFocus,
              },
            }}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Container>
    </div>
  );
}

export default BorrowEquipment;