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
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function BorrowEquipmentCreate() {
  const [BorrowEquipment_Day, setBorrowEquipment_Day] = useState<Date | null>();
  const [borrowequipment, setBorrowEquipment] = useState<
    Partial<BorrowEquipmentInterface>
  >({}); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [equipmentpurchasing, setEquipmentPurchasing] = useState<
    EquipmentPurchasingInterface[]
  >([]);
  const [user, setUser] = useState<UserInterface[]>([]);
  const [librarian, setLibrarian] = useState<LibrarianInterface[]>([]);
  const [errorMessage, setErrorMessage] = useState("");


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
    const id = event.target.id as keyof typeof borrowequipment; //
    // console.log(event.target.id);
    // console.log(event.target.value);
    const { value } = event.target;
    setBorrowEquipment({ ...borrowequipment, [id]: value });
  };
  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof borrowequipment; //
    console.log(event.target.name);
    console.log(event.target.value);
    const { value } = event.target;
    setBorrowEquipment({ ...borrowequipment, [name]: value });
  };
  // const handleChangePlanning = (event: React.ChangeEvent<{ value: any }>) => {
  //   //ตัวแปรชื่อ event
  //   console.log(event.target.value);
  //   setPlanningID(event.target.value);
  // };
  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? Number(data) : data; //Number(data)
    return val;
  };
  function submit() {
    let data = {
      //เก็บข้อมูลที่จะเอาไปเก็บในดาต้าเบส
      BorrowEquipment_Day: BorrowEquipment_Day,
      Amount_BorrowEquipment:
        Number(borrowequipment.Amount_BorrowEquipment) ?? "",
      UserID: Number(borrowequipment.UserID),
      EquipmentPurchasingID: Number(borrowequipment.EquipmentPurchasingID),
      LibrarianID: Number(localStorage.getItem("nid")),
    };
    console.log(data);
    const apiUrl = "http://localhost:8080/borrowEquipment";
    const requestOptions = {
      method: "POST", //เอาข้อมูลไปเก็บไว้ในดาต้าเบส
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    // fetch(`${apiUrl}/examschedules`, requestOptionsPost)
    // .then((response) => response.json())
    // .then((res) => {
    //   if (res.data) {
    //     setSuccess(true);
    //     setErrorMessage("");
    //   } else {
    //     setError(true);
    //     setErrorMessage(res.error);
    //   }
    // });

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
  const getEquipmentPurchasing = async () => {
    const apiUrl = "http://localhost:8080/equipmentPurchasing";
    fetch(apiUrl, requestOptions)
      .then((response) => response.json()) //เปลี่ยนจากเจสันเป็นจาว่าสคริปต์
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setEquipmentPurchasing(res.data);
        }
      });
  };
  const getUser = async () => {
    const apiUrl = "http://localhost:8080/users";
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setUser(res.data);
        }
      });
  };
  useEffect(() => {
    //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
    //ไม่ให้รันแบบอินฟินิตี้ลูป
    getEquipmentPurchasing();
    getLibrarian();
    getUser();
  }, []);
  return (
    <Container maxWidth="md">
      {/* <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} >
          <Alert onClose={handleClose} severity="success">
            บันทึกสำเร็จ
          </Alert>
        </Snackbar>
        <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            บันทึกไม่สำเร็จ: {errorMessage}
          </Alert>
        </Snackbar> */}
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
              เก็บข้อมูลการยืมอุปกรณ์
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={2} sx={{ padding: 1 }}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อ-นามสกุล สมาชิกห้องสมุด</p>
              <Select
                native
                value={borrowequipment.UserID}
                onChange={handleChange}
                inputProps={{
                  name: "UserID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกรายชื่อสมาชิก
                </option>
                {user.map((item: UserInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>รายการอุปกรณ์</p>
              <Select
                native
                value={borrowequipment.EquipmentPurchasingID}
                onChange={handleChange}
                inputProps={{
                  name: "EquipmentPurchasingID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกรายการอุปกรณ์
                </option>
                {equipmentpurchasing.map(
                  (item: EquipmentPurchasingInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.EquipmentName}
                    </option>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>จำนวนอุปกรณ์</p>
              <TextField
                id="Amount_BorrowEquipment"
                variant="standard"
                type="number"
                size="medium"
                value={borrowequipment.Amount_BorrowEquipment || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>วัน เวลา ที่ยืมอุปกรณ์</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  
                  value={BorrowEquipment_Day}
                  onChange={(newValue) => {
                    setBorrowEquipment_Day(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>บรรณารักษ์ผู้บันทึกข้อมูล</p>
              <Select
                // defaultOpen={true}
                disabled={true} //เป็นจางๆไม่ให้เปลี่ยน
                // labelId="เลขบัตรประชาชน"
                // id="เลขบัตรประชาชน"
                value={localStorage.getItem("nid")}
                // label="Name"
              >
                {librarian.map(
                  (
                    item: LibrarianInterface //map
                  ) => (
                    <MenuItem value={item.ID} key={item.ID}>
                      {item.Name}
                    </MenuItem> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/borrowEquipment"
              variant="contained"
            >
              กลับ
            </Button>
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="success"
            >
              บันทึกข้อมูล
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
export default BorrowEquipmentCreate;
