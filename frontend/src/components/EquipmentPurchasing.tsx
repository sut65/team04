import React from "react";
import { useEffect, useState, useCallback } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link as RouterLink } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import EditEquipmentPurchasing from "./EquipmentPurchasingEdit";
import { EquipmentPurchasingInterface } from "../models/IEquipmentPurchasing";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function EquipmentPurchasing() {
  const [equipmentPurchasing, setEquipmentPurchasing] = useState<
    EquipmentPurchasingInterface[]
  >([]);
  const [selectcellData, setSelectcellData] =
    useState<EquipmentPurchasingInterface>();

  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [opendelete, setOpenDelete] = useState(false);
  const [openedit, setOpenEdit] = useState(false);

  const [selectcell, setSelectCell] = useState(Number);
  const handleCellFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget.parentElement;
      const id = row?.dataset.id;
      const e = equipmentPurchasing.filter((v) => Number(v.ID) == Number(id));
      console.log(e[0]);
      setSelectcellData(e[0]);
    },
    [equipmentPurchasing]
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
    DeleteEquipmentPurchasing(Number(selectcellData?.ID));

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
  const DeleteEquipmentPurchasing = async (id: Number) => {
    const apiUrl = `http://localhost:8080/equipmentPurchasing/${id}`;
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
        console.log("ssssssssssssssss", res);
        //ตรงนี้คือลบในดาต้าเบสสำเร็จแล้ว
        if (res.data) {
          setSuccess(true);
          const remove = equipmentPurchasing.filter(
            //กรองเอาข้อมูลที่ไม่ได้ลบ
            (perv) => perv.ID !== selectcellData?.ID
          );
          setEquipmentPurchasing(remove);
        } else {
          setError(true);
        }
      });
  };

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
      headerName: "วันที่",
      width: 160,
      valueFormatter: (params) => format(new Date(params?.value), "P HH:mm:ss"),
    },
    {
      field: "actions",
      headerName: "การจัดการข้อมูล",
      width: 175,
      renderCell: () => (
        <div>
          <Button
            onClick={handleEdit}
            variant="contained"
            size="small"
            startIcon={<EditIcon />}
            color="warning"
          >
            แก้ไข
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            onClick={handleDelete}
            variant="contained"
            size="small"
            startIcon={<DeleteIcon />}
            color="error"
          >
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    GetAllEquipmentPurchasing();
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
            {"คุณต้องการลบใช่หรือไม่?"}
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
            <EditEquipmentPurchasing
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

export default EquipmentPurchasing;
