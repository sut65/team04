import React from "react";
import { useEffect, useState, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'; // Icon ลบ
import EditIcon from "@mui/icons-material/Edit";     // Icon เเก้ไข
import { LibrarianInterface } from "../models/ILibrarian";
import { BorrowBookInterface } from "../models/IBorrowBook";
import { BookCategoryInterface } from "../models/IBookCategory";
import { BookPurchasingInterface } from "../models/IBookPurchasing";
import EditBorrowBook from "./BorrowBookEdit";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function BorrowBook() {
    const [borrowbook, setBorrowBook] = useState<BorrowBookInterface[]>([]);
    const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
    const [error, setError] = useState(false);
    const [opendelete, setOpenDelete] = useState(false);
    const [openedit, setOpenEdit] = useState(false);

    const [selectcellData, setSelectcellData] = useState<BorrowBookInterface>();
    const handleCellFocus = useCallback(
      (event: React.FocusEvent<HTMLDivElement>) => {
        const row = event.currentTarget.parentElement;
        const id = row?.dataset.id;
        const b = borrowbook.filter((v) => Number(v.ID) == Number(id));
        console.log(b[0]);
        setSelectcellData(b[0]);
      },
      [borrowbook]
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
      DeleteBorrowBook(Number(selectcellData?.ID));
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


  const DeleteBorrowBook = async (id: Number) => {
    const apiUrl = `http://localhost:8080/borrow_books/${id}`;
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
        //ลบในดาต้าเบสสำเร็จแล้ว
        if (res.data) {
          setSuccess(true);
          const remove = borrowbook.filter(
            //กรองเอาข้อมูลที่ไม่ได้ลบ
            (perv) => perv.ID !== selectcellData?.ID
          );
          setBorrowBook(remove);
        } else {
          setError(true);
        }
      });
  };


  const GetAllBorrowBook = async () => {
    const apiUrl = "http://localhost:8080/borrow_books";
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
          setBorrowBook(res.data);
        }
      });
  };



  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 20 ,align: "center", headerAlign: "center",},
    {
      field: "จัดการข้อมูล",
      headerName: "จัดการข้อมูล",
      align: "center",
      headerAlign: "center",
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
    {
      field: "BorrowBookName",
      headerName: "ชื่อผู้ยืมหนังสือ",
      width: 180,
      valueGetter: (params) => {
        return params.getValue(params.id, "User").Name;
      },
    },
    {
      field: "Idcard",
      headerName: "เลขบัตรประชาชน",
      width: 160,
      valueGetter: (params) => {
        return params.getValue(params.id, "User").Idcard
      },
    },
    {
      field: "BookName",
      headerName: "ชื่อหนังสือ",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "BookPurchasing").BookName;
      },
    },
    {
      field: "BookCategory",
      headerName: "หมวดหมู่หนังสือ",
      width: 200,
      valueGetter: (params) => {
        return params.getValue(params.id, "BookPurchasing").BookCategory.Name;
      },
    },
    { 
      field: "Color_Bar", 
      headerName: "เเถบสีหนังสือ", 
      width: 110
    },
    { 
      field: "Borb_Frequency", 
      headerName: "จำนวนครั้งที่ยืมหนังสือ", 
      align: "center",
      headerAlign: "center",
      width: 150
    },
    {
      field: "Borb_Day",
      headerName: "วันที่ยืมหนังสือ",
      align: "center",
      headerAlign: "center",
      width: 200,
      valueFormatter: (params) => format(new Date(params?.value), "dd/MM/yyyy"),
    },
    {
      field: "Return_Day",
      headerName: "วันกำหนดคืนหนังสือ",
      align: "center",
      headerAlign: "center",
      width: 200,
      valueFormatter: (params) => format(new Date(params?.value), "dd/MM/yyyy"),
    },
    {
      field: "LibrarianName",
      headerName: "บรรณารักษ์ผู้บันทึก",
      width: 150,
      valueGetter: (params) => {
        return params.getValue(params.id, "Librarian").Name;
      },
    },
   
  ];


  useEffect(() => {
    GetAllBorrowBook();
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
            <EditBorrowBook
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
          <Box sx={{ bgcolor: 'text.primary' }} flexGrow={1}>
            <Typography
              component="h1"
              variant="h6"
              color="white"
              gutterBottom
            >
              &nbsp;&nbsp;&nbsp;  รายการ-การยืมหนังสือ
            </Typography>
          </Box>

          <Box>
            <Button
              component={RouterLink}
              to="/borrowbook/create"
              variant="contained"
              color="primary"
            >
              บันทึกการยืมหนังสือ
            </Button>
          </Box>
        </Box>

        <div style={{ height: 600, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={borrowbook}
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

export default BorrowBook;

