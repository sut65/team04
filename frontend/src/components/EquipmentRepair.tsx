import React from "react";
import { useEffect, useState, useCallback } from "react";
import EditEquipmentRepair from "./EquipmentRepairEdit";
import { EquipmentRepairInterface } from "../models/IEquipmentRepair";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { LibrarianInterface } from "../models/ILibrarian";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function EquipmentRepair() {
  const [equipmentrepair, setEquipmentRepair] = useState<EquipmentRepairInterface[]>([]);
  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [opendelete, setOpenDelete] = useState(false);
  const [openedit, setOpenEdit] = useState(false);
  const [selectcellData, setSelectcellData] = useState<EquipmentRepairInterface>();

  const [selectcell, setSelectCell] = useState(Number);
  const handleCellFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget.parentElement;
      const id = row!.dataset.id!;
      const b = equipmentrepair.filter((v) => Number(v.ID) == Number(id));
      const field = event.currentTarget.dataset.field!;
      console.log(b[0]);
      setSelectcellData(b[0]);
      setSelectCell(Number(id));
    },
    [equipmentrepair]
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
    DeleteEquipmentRepair(selectcell);
    setOpenDelete(false);
  };
  const handleDelete = () => {
    setOpenDelete(true);
  };
  const handleEdit = () => {
    setOpenEdit(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
  };
  const DeleteEquipmentRepair = async (id: Number) => {
    const apiUrl = `http://localhost:8080/equipmentrepair/${id}`;
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
        console.log(res);

        if (res) {
          setSuccess(true);
          window.location.reload();
        } else {
          setError(true);
        }
      });
  };

  const GetAllEquipmentRepair = async () => {
    const apiUrl = "http://localhost:8080/equipmentrepair";

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
          setEquipmentRepair(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 20 },
    {
      field: "EquipmentNameRepair", //getValue ชื่อห้ามซ้ำกัน
      headerName: "ชื่ออุปกรณ์ที่แจ้งซ่อม",
      width: 215,
      valueGetter: (params) => {
        return params.getValue(params.id, "EquipmentPurchasing").EquipmentName;
      },
    },
    {
      field: "EquipmentRepairLevelName", //getValue ชื่อห้ามซ้ำกัน
      headerName: "ระดับความเสียหายของอุปกรณ์",
      width: 215,
      valueGetter: (params) => {
        return params.getValue(params.id, "Level").Name;
      },
    },
    { field: "Note", headerName: "หมายเหตุ", width: 250 },
    {
      field: "Date",
      headerName: "วันที่",
      width: 170,
      valueFormatter: (params) => format(new Date(params?.value), "dd/MM/yyyy"),
    },
    {
      field: "LibrarianName",
      headerName: "ผู้บันทึกข้อมูล",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "Librarian").Name;
      },
    },

    {
      field: "actions",
      headerName: "จัดการรายการแจ้งซ่อม",
      width: 175,
      renderCell: () => (
        <div>
          &nbsp;
          <Button
            onClick={handleEdit}
            variant="contained"
            size="small"
            startIcon={<EditIcon />}
            color="success"
          >
            แก้ไข
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            onClick={handleDelete}
            variant="contained"
            size="small"
            startIcon={<DeleteForeverIcon />}
            color="error"
          >
            ลบ
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      ),
    },
  ];

  useEffect(() => {
    GetAllEquipmentRepair();
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
            {"คุณต้องการลบรายการแจ้งซ่อมใช่หรือไม่?"}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleDeleteClose}>ยกเลิก</Button>
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
            <EditEquipmentRepair
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
              &nbsp;&nbsp;&nbsp; รายการแจ้งซ่อมอุปกรณ์
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/equipmentrepair/create"
              variant="contained"
              color="primary"
            >
              แจ้งซ่อมอุปกรณ์
            </Button>
          </Box>
        </Box>

        <div style={{ height: 600, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={equipmentrepair}
            getRowId={(row) => row.ID}
            columns={columns}
            pageSize={5}
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

export default EquipmentRepair;
