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
import { ReturnEquipmentInterface } from "../models/IReturnEquipment";
import { EquipmentStatusInterface } from "../models/IEquipmentStatus";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Icon ลบ
import EditIcon from "@mui/icons-material/Edit";     // Icon เเก้ไข
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Snackbar from "@mui/material/Snackbar";
import EditReturnEquipment from "./ReturnEquipmentEdit";



const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ReturnEquipment() {
  const [returnequipment, setReturnEquipment] = useState<ReturnEquipmentInterface[]>([]);
  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [opendelete, setOpenDelete] = useState(false);
  const [selectcellData, setSelectcellData] = useState<ReturnEquipmentInterface>();
  const [openedit, setOpenEdit] = useState(false);

  
  const handleCellFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget.parentElement;
      const id = row!.dataset.id!;
      const b = returnequipment.filter((v) => Number(v.ID) == Number(id));
      console.log(b[0]);
      setSelectcellData(b[0]);
    },
    [returnequipment]
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
      // setselectcellData(selectcellData);
      DeleteReturnEquipment(Number(selectcellData?.ID));
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

  const DeleteReturnEquipment = async (id: Number) => {
    const apiUrl = `http://localhost:8080/returnEquipment/${id}`;
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
          const remove = returnequipment.filter(
            //กรองเอาข้อมูลที่ไม่ได้ลบ
            (perv) => perv.ID !== selectcellData?.ID
          );
          setReturnEquipment(remove);
        } else {
          setError(true);
        }
      });
  };



  const GetAllReturnEquipment = async () => {
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
      width: 70 
    },

    {
      field: "ReturnEquipmentName",
      headerName: "ชื่อผู้ที่เคยยืมอุปกรณ์",
      align: "center",
      headerAlign: "center",
      width: 200,
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
    GetAllReturnEquipment();
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
            <EditReturnEquipment
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

export default ReturnEquipment;