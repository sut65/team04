import React, { useCallback } from "react";
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
import { UserInterface } from "../models/IUser";
import { LibrarianInterface } from "../models/ILibrarian";
import { BookPurchasingInterface } from "../models/IBookPurchasing";
import { BorrowBookInterface } from "../models/IBorrowBook";
import { DatePicker } from "@mui/x-date-pickers";
import BorrowBook from "./BorrowBook";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


interface BorrowBook {
  Cancle: () => void;
  Data: BorrowBookInterface | undefined;
}


function EditBorrowBook({ Cancle, Data }: BorrowBook) {
  const [borb_day, setBorb_Day] = useState<Date | null>(new Date());
  const [return_day, setReturn_Day] = useState<Date | null>(new Date());
  const [borrowbook, setBorrowBook] = useState<Partial<BorrowBookInterface>>({
          ID:                Data?.ID,
          Borb_Day:          Data?.Borb_Day,
          Return_Day:        Data?.Return_Day,
          Color_Bar:         Data?.Color_Bar,
          Borb_Frequency:    Data?.Borb_Frequency,
          LibrarianID:       Data?.LibrarianID,
          UserID:            Data?.UserID,
          BookPurchasingID:  Data?.BookPurchasingID,
        }); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
  const [bookpurchasing, setBookPurchasing] = useState<BookPurchasingInterface[]>([]);
  const [user, setUser] = useState<UserInterface[]>([]);
  const [librarian, setLibrarian] = useState<LibrarianInterface[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  
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
    const id = event.target.id as keyof typeof borrowbook;
      console.log(event.target.id);
      console.log(event.target.value);
    const { value } = event.target;
      setBorrowBook({ ...borrowbook, [id]: value });
  };



  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof borrowbook; //
      console.log("name", event.target.name);
      console.log("value", event.target.value);
    const { value } = event.target;
      setBorrowBook({ ...borrowbook, [name]: value });
  };



  function submit() {
    let data = {
      //เก็บข้อมูลที่จะเอาไปเก็บในดาต้าเบส
      ID:                Number(borrowbook.ID),
      Borb_Day:          borb_day,  //?.toISOString()
      Return_Day:        return_day,
      Color_Bar:         borrowbook.Color_Bar ?? "",
      Borb_Frequency:    Number(borrowbook.Borb_Frequency) ?? "",
      UserID:            Number(borrowbook.UserID),
      BookPurchasingID:  Number(borrowbook.BookPurchasingID),
      LibrarianID:       Number(localStorage.getItem("nid")),
    };
    console.log(data);


    const apiUrl = `http://localhost:8080/borrow_books`;
    const requestOptions = {
      method: "PATCH", //เอาข้อมูลไปอัพเดตในดาต้าเบส
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
          // window.location.reload();
          setErrorMessage("")
        } else {
          console.log("บันทึกไม่ได้")
          setError(true);
          setErrorMessage(res.error)
        }
      })
  }


  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
      "Content-Type": "application/json",
    },
  };

  // บรรณารักษ์ Librarian
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



  // บรรณารักษ์ Librarian
  const getBorrowBook = async () => {
    const apiUrl = "http://localhost:8080/borrow_books";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setBorrowBook(res.data);
        }
      });
  };



  // การจัดซื้อหนังสือ BookPurchasing
  const getBookPurchasing = async () => {
    const apiUrl = "http://localhost:8080/bookPurchasing";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setBookPurchasing(res.data);
        }
      });
  };


  
  // สมาชิกห้องสมุด User
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
    getUser();
    getBookPurchasing();
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
          <Box sx={{ bgcolor: 'text.primary' }} flexGrow={1}>
            <Typography
              component="h3"
              variant="h5"
              color="white"
              gutterBottom
            >
              <br/>
              <div>
              &emsp;&emsp;&emsp;
              &emsp;&emsp;
              เเก้ไขข้อมูลการยืมหนังสือ 
              </div>
              <br/>
            </Typography>
          </Box>
        </Box>
        <Divider />


        <Box sx={{ bgcolor: '#FFF8DC' }} flexGrow={1}>
        <Grid container spacing={2} sx={{ padding: 1 }}>
          
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
            <b><p>ผู้ยืมหนังสือ</p></b>
              <Select
                native
                value={borrowbook.UserID}
                onChange={handleChange}
                inputProps={{
                  name: "UserID", //เอาไว้เข้าถึงข้อมูลuserไอดี
                }}
              >
                <option aria-label="None" value="">
                    กรุณาเลือกรายชื่อสมาชิกห้องสมุด
                </option>
                {user.map((item: UserInterface) => (
                    <option value={item.ID} key={item.ID}>
                      ชื่อ: {item.Name} | เลขบัตรประชาชน: {item.Idcard}
                    </option> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
            <b><p>ชื่อเเละหมวดหมู่ของหนังสือที่ยืม</p></b>
              <Select
                // id="BookPurchasingID"
                native
                value={borrowbook.BookPurchasingID}
                onChange={handleChange}
                inputProps={{
                  name: "BookPurchasingID", //เอาไว้เข้าถึงข้อมูล BookPurchasingID
                }}
              >
                <option aria-label="None" value="">
                    กรุณาเลือกชื่อเเละหมวดหมู่หนังสือที่ยืม
                </option>
                {bookpurchasing.map((item: BookPurchasingInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.BookName} | หมวดหมู่หนังสือ:{" "}
                      {item.BookCategory.Name}
                    </option> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>



          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
            <b><p>เเถบสีหนังสือ</p></b>
              <TextField
                id="Color_Bar"
                variant="standard"
                type="string"
                size="medium"
                value={borrowbook.Color_Bar || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>



          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
            <b><p>จำนวนครั้งที่ยืมหนังสือ</p></b>
              <TextField
                id="Borb_Frequency"
                variant="standard"
                type="number"
                size="medium"
                value={borrowbook.Borb_Frequency || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>



          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
            <b><p>วันที่ยืมหนังสือ</p></b>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={borb_day}
                  onChange={(newValue) => {
                    setBorb_Day(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>



          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
            <b><p>วันกำหนดคืนหนังสือ</p></b>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={return_day}
                  onChange={(newValue) => {
                    setReturn_Day(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <FormControl fullWidth variant="standard">
            <b><p>บรรณารักษ์ผู้บันทึกข้อมูล</p></b>
              <Select
                disabled={true} //เป็นจางๆไม่ให้เปลี่ยน
                value={localStorage.getItem("nid")}
              >
                {librarian.map(
                  (
                    item: LibrarianInterface //map
                  ) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Name}
                    </option> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <Button variant="contained" onClick={Cancle}>
              ยกเลิก
            </Button>

            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="warning"
            >
              ยืนยันการเเก้ไขข้อมูล
            </Button>
          </Grid>
        </Grid>
       </Box>
      </Paper>
    </Container>
  );
}

export default EditBorrowBook;