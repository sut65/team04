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
import { UserInterface } from "../models/IUser";
import { BookPurchasingInterface } from "../models/IBookPurchasing";
import { LibrarianInterface } from "../models/ILibrarian";
import { BorrowBookInterface } from "../models/IBorrowBook";
import { ReturnBookInterface } from "../models/IReturnBook";
import { LostBookInterface } from "../models/ILostBook";
import ReturnBook from "./ReturnBook";
import { get } from "https";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ReturnBookCreate() {
  const [current_day, setCurrent_Day ] = useState<Date | null>();
  const [late_number, setLate_Number] = useState<Date | null>();
  const [returnbook, setReturnBook] = useState<Partial<ReturnBookInterface>>({}); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
  const [borrowbook, setBorrowBook] = useState<BorrowBookInterface[]>([]);
  const [lostbook, setLostBook] = useState<LostBookInterface[]>([]);
  const [librarian, setLibrarian] = useState<LibrarianInterface[]>([]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);


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
    const id = event.target.id as keyof typeof returnbook; 
      console.log(event.target.id);
      console.log(event.target.value);
    const { value } = event.target;
      setReturnBook({ ...returnbook, [id]: value });
  };



  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof returnbook; //
      console.log(event.target.name);
      console.log(event.target.value);

    const { value } = event.target;
      setReturnBook({ ...returnbook, [name]: value });
  };



  function submit() {
    let data = {
      //เก็บข้อมูลที่จะเอาไปเก็บในดาต้าเบส
      Current_Day:     new Date(),
	    Late_Number:     returnbook.Late_Number ?? "",
	    Book_Condition:  returnbook.Book_Condition ?? "",
      LostBookID:      returnbook.LostBookID,
      LibrarianID:     Number(localStorage.getItem("nid")),
      BorrowBookID:    returnbook.BorrowBookID,
    };
    console.log(data);


    const apiUrl = "http://localhost:8080/return_books";
    const requestOptions = {
      method: "POST", //เอาข้อมูลไปเก็บไว้ในดาต้าเบส
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
            setSuccess(true);
            getBorrowBook();
        } else {
            setError(true);
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


// การยืมหนังสือ BorrowBook
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

  
// การทำหนังสือหาย LostBook
  const getLostBook = async () => {
    const apiUrl = "http://localhost:8080/lost_books";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setLostBook(res.data);
        }
      });
  };


  useEffect(() => {
    //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
    //ไม่ให้รันแบบอินฟินิตี้ลูป
    getLostBook();
    getBorrowBook();
    getLibrarian();
  }, []);


  return (
    <Container maxWidth="md">
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>

      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ
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
              บันทึกการคืนหนังสือ
            </Typography>
          </Box>
        </Box>
        <Divider />

        <Grid container spacing={3} sx={{ padding: 2 }}>

          <Grid item xs={12}>
            <FormControl fullWidth variant="standard">
              <p>ผู้ที่เคยยืมหนังสือ</p>
              <Select
                // id="BorrowBookID"
                value={returnbook.BorrowBookID}
                onChange={handleChange}
                inputProps={{
                  name: "BorrowBookID", //เอาไว้เข้าถึงข้อมูล borrowbookไอดี
                }}
              >
                {borrowbook.map(
                  (
                    item: BorrowBookInterface //map
                  ) => (
                    <MenuItem value={item.ID} key={item.ID}>
                      ชื่อ: {item.User.Name} | 
                      เลขบัตรประชาชน: {item.User.Idcard} | 
                      ชื่อหนังสือ: {item.BookPurchasing.BookName} | 
                      หมวดหมู่: {item.BookPurchasing.BookCategory.Name} |
                      เเถบสี: {item.Color_Bar} 
                      {/* วันกำหนดคืน: {item.Return_Day}  */}
                    </MenuItem> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>



          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>วันที่คืนหนังสือ</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  value={current_day}
                  onChange={(newValue) => {
                    setCurrent_Day(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>



          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>จำนวนวันเลยกำหนดคืน(วัน)</p>
              <TextField
                id="Late_Number"
                variant="standard"
                type="number"
                size="medium"
                value={returnbook.Late_Number || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>



          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>หนังสือหาย(หาย/ไม่หาย)</p>
              <Select
                // id="LostBookID"
                value={returnbook.LostBookID}
                onChange={handleChange}
                inputProps={{
                  name: "LostBookID", //เอาไว้เข้าถึงข้อมูล LostBookID
                }}
              >
                {lostbook.map(
                  (
                    item: LostBookInterface //map
                  ) => (
                    <MenuItem value={item.ID} key={item.ID}>
                      {item.Name}
                    </MenuItem> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>



          <Grid item xs={6}>
            <FormControl fullWidth variant="standard"> 
              <p>สภาพหนังสือ</p>
              <TextField
                id="Book_Condition"
                variant="standard"
                type="string"
                size="medium"
                value={returnbook.Book_Condition || ""}
                onChange={handleInputChange}
              />
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
            <Button component={RouterLink} to="/borrowbook" variant="contained">
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

export default ReturnBookCreate;