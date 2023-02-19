import React from "react";
import EditBookPurchasing from "./BookPurchasingEdit";
import { useEffect, useState, useCallback } from "react";
import { BookPurchasingInterface } from "../models/IBookPurchasing";
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
import DialogTitle from "@mui/material/DialogTitle";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function BookPurchasing() {
  const [bookpurchasing, setBookPurchasing] = useState<
    BookPurchasingInterface[]
  >([]);

  const [selectcellData, setSelectcellData] =
    useState<BookPurchasingInterface>();
  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [opendelete, setOpenDelete] = useState(false);
  const [openedit, setOpenEdit] = useState(false);

  const handleCellFocus = useCallback(
    //การเรียกใช้ระหว่าง component
    (event: React.FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget.parentElement;
      const id = row?.dataset.id;
      const b = bookpurchasing.filter((v) => Number(v.ID) == Number(id));
      console.log(b[0]);
      setSelectcellData(b[0]);
    },
    [bookpurchasing]
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
    DeleteBookPurchasing(Number(selectcellData?.ID));

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
  const DeleteBookPurchasing = async (id: Number) => {
    const apiUrl = `http://localhost:8080/bookPurchasing/${id}`;
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
          const remove = bookpurchasing.filter(
            //กรองเอาข้อมูลที่ไม่ได้ลบ
            (perv) => perv.ID !== selectcellData?.ID
          );
          setBookPurchasing(remove);
        } else {
          setError(true);
        }
      });
  };

  const GetAllBookPurchasing = async () => {
    const apiUrl = "http://localhost:8080/bookPurchasing";

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
          setBookPurchasing(res.data);
        }
      });
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 20 },
    {
      field: "BookName",
      headerName: "ชื่อหนังสือ",
      width: 215,
    },
    {
      field: "BookCategoryName", //getValue ชื่อห้ามซ้ำกัน
      headerName: "ประเภทหนังสือ",
      width: 215,
      valueGetter: (params) => {
        return params.getValue(params.id, "BookCategory").Name;
      },
    },
    { field: "AuthorName", headerName: "ผู้แต่งหนังสือ", width: 215 },
    {
      field: "PublisherName",
      headerName: "สำนักพิมพ์",
      width: 215,
      valueGetter: (params) => {
        return params.getValue(params.id, "Publisher").Name;
      },
    },
    { field: "Amount", headerName: "จำนวน(เล่ม)", width: 150 },
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
      width: 170,
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
    GetAllBookPurchasing();
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
            <EditBookPurchasing
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
              รายการจัดซื้อหนังสือ
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/bookPurchasingCreate"
              variant="contained"
              color="primary"
            >
              สั่งซื้อหนังสือ
            </Button>
          </Box>
        </Box>

        <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={bookpurchasing}
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

export default BookPurchasing;
