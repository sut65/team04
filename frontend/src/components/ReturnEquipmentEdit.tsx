import React from "react";
import { Link as RouterLink } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useEffect, useState } from "react";
import { BorrowEquipmentInterface } from "../models/IBorrowEquipment";
import { EquipmentPurchasingInterface } from "../models/IEquipmentPurchasing";
import { UserInterface } from "../models/IUser";
import { LibrarianInterface } from "../models/ILibrarian";
import { EquipmentStatusInterface } from "../models/IEquipmentStatus";
import { ReturnEquipmentInterface } from "../models/IReturnEquipment";
import ReturnEquipment from "./ReturnEquipment";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface ReturnEquipment {
    Cancle: () => void;
    Data: ReturnEquipmentInterface | undefined;
  }


function EditReturnEquipment({ Cancle, Data }: ReturnEquipment) {

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [return_day, setReturn_Day] = useState<Date | null>(new Date());
  const [equipmentstatus, setEquipmentStatus] = useState<EquipmentStatusInterface[]>([]);
  const [user, setUser] = useState<UserInterface[]>([] );
  const [librarian, setLibrarian] = useState<LibrarianInterface[]>([]);
  const [borrowequipment, setBorrowEquipment] = useState<BorrowEquipmentInterface[]>([]); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
  const [errorMessage, setErrorMessage] = useState("");
  const [returnequipment, setReturnEquipment] = useState<Partial<ReturnEquipmentInterface>>({
    ID:                     Data?.ID,
    Return_Day:             Data?.Return_Day,
	  Return_Detail:          Data?.Return_Detail,
	  EquipmentStatusID:      Data?.EquipmentStatusID,
	  LibrarianID:            Data?.LibrarianID,
	  BorrowEquipmentID:      Data?.BorrowEquipmentID,

  }); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน


  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };


  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const id = event.target.id as keyof typeof returnequipment; //
    console.log(event.target.id);
    console.log(event.target.value);
    const { value } = event.target;
    setReturnEquipment({ ...returnequipment, [id]: value });
  };
  

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof returnequipment; //
    console.log(event.target.name);
    console.log(event.target.value);
    const { value } = event.target;
    setReturnEquipment({ ...returnequipment, [name]: value });
  };
  

  function submit() {
    let data = {
      //เก็บข้อมูลที่จะเอาไปเก็บในดาต้าเบส
      ID:                   Number(returnequipment.ID),
      Return_Day:           return_day,
      Return_Detail:        returnequipment.Return_Detail ?? "",
      BorrowEquipmentID:    Number(returnequipment.BorrowEquipmentID),
      EquipmentStatusID:    Number(returnequipment.EquipmentStatusID),  
      LibrarianID:          Number(localStorage.getItem("nid")),
    };

    console.log(data);

    const apiUrl = "http://localhost:8080/returnEquipment";
    const requestOptions = {
      method: "PATCH", //เอาข้อมูลไปเก็บไว้ในดาต้าเบส
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.data) {
          console.log("บันทึกได้")
          setSuccess(true);
          setErrorMessage("")
        } else {
          console.log("บันทึกไม่ได้")
          setError(true);
          setErrorMessage(res.error)
        }
      });
  }

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
      "Content-Type": "application/json",
    },
  };

  const getLibrarian = async () => {
    const apiUrl = "http://localhost:8080/librarian";
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setLibrarian(res.data);
        }
      });
  };

  const getBorrowEquipment = async () => {
    const apiUrl = `http://localhost:8080/BorrowEquipmentForTrackingCheck`;
    fetch(apiUrl, requestOptions)
      .then((response) => response.json()) //เปลี่ยนจากเจสันเป็นจาว่าสคริปต์
      .then((res) => {
        console.log("borrowEquipment", res.data);
        if (res.data) {
            setBorrowEquipment(res.data);
        }
      });
  };

const getEquipmentStatus = async () => {
    const apiUrl = "http://localhost:8080/equipment_statuses";
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
            setEquipmentStatus(res.data);
        }
      });
  };

  
  useEffect(() => {
    //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
    //ไม่ให้รันแบบอินฟินิตี้ลูป
    getEquipmentStatus();
    getBorrowEquipment();
    getLibrarian();
  }, []);


  return (
    <Container maxWidth="md">
      <Snackbar
        id="success"
        open={success}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
        บันทึกสำเร็จ
        </Alert>
      </Snackbar>

      <Snackbar 
        id="error"
        open={error} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >

        <Alert onClose={handleClose} severity="error">
        บันทึกไม่สำเร็จ: {errorMessage}
        </Alert>
      </Snackbar>

      <Paper>
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box sx={{ paddingX: 2, paddingY: 1 }}>
            <Typography
              component="h1"
              variant="h6"
              color="primary"
              gutterBottom
            >
            แก้ไขข้อมูลบันทึกการยืมอุปกรณ์ ลำดับที่ {returnequipment.ID}
            </Typography>
          </Box>
        </Box>
        <Divider />


        <Grid container spacing={3} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="standard">
              <p>ผู้ที่เคยยืมอุปกรณ์</p>
              <Select

                native
                value={returnequipment.BorrowEquipmentID}
                onChange={handleChange}
                inputProps={{
                  name: "BorrowEquipmentID", //เอาไว้เข้าถึงข้อมูล borrow equipment ไอดี
                }}
              >
                {borrowequipment.map((item: BorrowEquipmentInterface) => (
                    <option value={item.ID} key={item.ID}>
                      ชื่อ: {item.User.Name} | 
                      ชื่ออุปกรณ์: {item.EquipmentPurchasing.EquipmentName} | 
                      จำนวนอุปกรณ์ที่ยืม: {item.Amount_BorrowEquipment} ชิ้น | 
                    </option> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>วัน เวลา ที่คืนอุปกรณ์</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  value={return_day}
                  onChange={(newValue) => {
                    setReturn_Day(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>


          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>สภาพอุปกรณ์(ชำรุด/ไม่ไม่ชำรุด)</p>
              <Select
                native
                value={returnequipment.EquipmentStatusID}
                onChange={handleChange}
                inputProps={{
                  name: "EquipmentStatusID", //เอาไว้เข้าถึงข้อมูล EquipmentStatusID
                }}
              >
                {equipmentstatus.map((item: EquipmentStatusInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Name}
                    </option> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <b><p>รายละเอียดเพิ่มเติม</p></b>
              <TextField
                id="Return_Detail"
                variant="standard"
                type="string"
                size="medium"
                value={returnequipment.Return_Detail || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>บรรณารักษ์ผู้บันทึกข้อมูล</p>
              <Select
                disabled={true} //เป็นจางๆไม่ให้เปลี่ยน
                value={localStorage.getItem("nid")}
              >
                {librarian.map((item: LibrarianInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Name}
                    </option> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button 
                variant="contained"
                onClick={Cancle} 
            >
              ยกเลิก
            </Button>

            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="success"
            >
              บันทึกการแก้ไขข้อมูล
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
export default EditReturnEquipment;