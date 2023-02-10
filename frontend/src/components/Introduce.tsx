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
import { IntroduceInterface } from "../models/IIntroduce";
import IntroduceEdit from "./IntroduceEdit";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Introduce() {
  const [introduce, setIntroduce] = useState<IntroduceInterface[]>([]);

  const [selectcellData, setSelectcellData] =
    useState<IntroduceInterface>();

  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [opendelete, setOpenDelete] = useState(false);
  const [openedit, setOpenEdit] = useState(false);

  const handleCellFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget.parentElement;
      const id = row?.dataset.id;
      const b = introduce.filter((v) => Number(v.ID) == Number(id));
      console.log(b[0]);
      setSelectcellData(b[0]);
    },
    [introduce]
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
    DeleteIntroduce(Number(selectcellData?.ID));

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


const DeleteIntroduce = async (id: Number) => {
  const apiUrl = `http://localhost:8080/introduce/${id}`;
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
      const remove = introduce.filter(
        //กรองเอาข้อมูลที่ไม่ได้ลบ
        (perv) => perv.ID !== selectcellData?.ID
      );
      setIntroduce(remove);
    } else {
      setError(true);
    }
  });
};

const GetAllIntroduce = async () => {
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
    GetAllIntroduce();
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
            <IntroduceEdit
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
              บันทึกการแนะนำหนังสือ
            </Button>
          </Box>
        </Box>

        <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={introduce}
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

export default Introduce;