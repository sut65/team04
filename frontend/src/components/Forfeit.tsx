import React , { useCallback, useState, useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef , GridRowParams} from "@mui/x-data-grid";
import { format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import DialogTitle from "@mui/material/DialogTitle";
import { ForfeitInterface } from "../models/IForfeit";
import ForfeitEdit from "./ForfeitEdit";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Forfeit() {
  const [forfeit, setForfeit] = useState<
    ForfeitInterface[]
  >([]);

  const [selectcellData, setSelectcellData] =
    useState<ForfeitInterface>();

  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [opendelete, setOpenDelete] = useState(false);
  const [openedit, setOpenEdit] = useState(false);

  
  const handleCellFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget.parentElement;
      const id = row?.dataset.id;
      const b = forfeit.filter((v) => Number(v.ID) == Number(id));
      console.log(b[0]);
      setSelectcellData(b[0]);
    },
    [forfeit]
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
    DeleteForfeit(Number(selectcellData?.ID));

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

  const DeleteForfeit = async (id: Number) => {
    const apiUrl = `http://localhost:8080/forfeit/${id}`;
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
          const remove = forfeit.filter(
            //กรองเอาข้อมูลที่ไม่ได้ลบ
            (perv) => perv.ID !== selectcellData?.ID
          );
          setForfeit(remove);
        } else {
          setError(true);
        }
      });
  };

  const GetAllForFeit = async () => {
    const apiUrl = "http://localhost:8080/forfeit";
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
          setForfeit(res.data);
        }
      });
  };

  
    const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 20 },
    {
        field: "UserName",
        headerName: "ชื่อผู้ยืมหนังสือ",
        width: 200,
        valueGetter: (params) => {
          return params.getValue(params.id, "ReturnBook").BorrowBook.User.Name;
        },
    },
    {
        field: "BookName",
        headerName: "ชื่อหนังสือ",
        width: 350,
        valueGetter: (params) => {
          return params.getValue(params.id, "ReturnBook").BorrowBook.BookPurchasing.BookName;
        },
    },
    {
      field: "Amount",
      headerName: "ราคาหนังสือ",
      width: 130,
      valueGetter: (params) => {
        return params.getValue(params.id, "ReturnBook").BorrowBook.BookPurchasing.Amount;
      },
  },
    {
        field: "LostBookName",
        headerName: "การทำหนังสือหาย",
        width: 150,
        valueGetter: (params) => {
          return params.getValue(params.id, "ReturnBook").LostBook.Name;
        },
    },
    {
        field: "LateNumber",
        headerName: "จำนวนวันที่เกินกำหนดการคืน",
        width: 200,
        valueGetter: (params) => {
          return params.getValue(params.id, "ReturnBook").Late_Number;
        },
    },
    { field: "Pay", headerName: "เงินค่าปรับ", width: 100 },
    {
      field: "PaymentName",
      headerName: "วิธีการชำระเงิน",
      width: 250,
      valueGetter: (params) => {
        return params.getValue(params.id, "Payment").Name;
      },
    },
    { field: "Note", headerName: "หมายเหตุ", width: 250 },
    { field: "ModulateNote", headerName: "การขอลดหย่อน", width: 250 },
    {
      field: "Pay_Date",
      headerName: "วันที่และเวลาที่บันทึกค่าปรับ",
      width: 200,
      valueFormatter: (params) => format(new Date(params?.value), "P hh:mm a"),
    },
    {
        field: "LibrarianName",
        headerName: "บรรณารักษ์ผู้บันทึก",
        width: 200,
        valueGetter: (params) => {
          return params.getValue(params.id, "Librarian").Name;
        },
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
            color="success"
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
      GetAllForFeit();
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
              <ForfeitEdit
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
                ข้อมูลการบันทึกค่าปรับ
              </Typography>
            </Box>
  
            <Box>
              <Button
                component={RouterLink}
                to="/forfeit/create"
                variant="contained"
                color="primary"
              >
                บันทึกการบันทึกค่าปรับ
              </Button>
            </Box>
          </Box>
  
          <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
            <DataGrid
              rows={forfeit}
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

export default Forfeit;