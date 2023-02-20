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
import { LibrarianInterface } from "../models/ILibrarian";
import { BorrowBookInterface } from "../models/IBorrowBook";
import { ReturnBookInterface } from "../models/IReturnBook";
import { LostBookInterface } from "../models/ILostBook";
import ReturnBook from "./ReturnBook";
import { DatePicker } from "@mui/x-date-pickers";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ReturnBookCreate() {
  const [current_day, setCurrent_Day] = useState<Date | null>(new Date());
  const [returnbook, setReturnBook] = useState<Partial<ReturnBookInterface>>({}); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
  const [borrowbook, setBorrowBook] = useState<BorrowBookInterface[]>([]);
  const [lostbook, setLostBook] = useState<LostBookInterface[]>([]);
  const [librarian, setLibrarian] = useState<LibrarianInterface[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
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
      Current_Day:      current_day,
      Late_Number:      Number(returnbook.Late_Number) ?? "",
      Book_Condition:   returnbook.Book_Condition ?? "",
      LostBookID:       Number(returnbook.LostBookID),
      LibrarianID:      Number(localStorage.getItem("nid")),
      BorrowBookID:     Number(returnbook.BorrowBookID),
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
          console.log("บันทึกได้")
          setSuccess(true);
          setErrorMessage("")
          getBorrowBook();
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
    const apiUrl = "http://localhost:8080/BorrowBookForTrackingCheck";

    fetch(apiUrl, requestOptions)
    .then((response) => response.json()) //เปลี่ยนจากเจสันเป็นจาว่าสคริปต์
    .then((res) => {
      console.log("borrowbook", res.data);
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


  // จัดรูปเเเบบวันที่
  const DateFormat = (date : any) => {
    let dateStyle = new Date(date)
    return `${dateStyle.toLocaleDateString("en-US")}`
  }


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
             &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
             &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
             บันทึกการคืนหนังสือ
              <br/><br/>
            </Typography>
          </Box>
        </Box>
        <Divider />


        <Box sx={{ bgcolor: '#fce4ec' }} flexGrow={1}>
        <Grid container spacing={3} sx={{ padding: 2 }}>
          
        <Grid item xs={12}>
            <FormControl fullWidth variant="standard">
              <Typography variant="inherit">
              <Paper sx={{bgcolor: "#FFFFCC",  spacing: 3, padding: 2}}>
              <b>จำนวนรายการที่เหลือ {borrowbook.length} รายการ</b>
              </Paper>
              </Typography>
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <FormControl fullWidth variant="standard">
              <b><p>ผู้ที่เคยยืมหนังสือ</p></b>
              <Select
                // id="BorrowBookID"
                native
                value={returnbook.BorrowBookID}
                onChange={handleChange}
                inputProps={{
                  name: "BorrowBookID", //เอาไว้เข้าถึงข้อมูล borrowbookไอดี
                }}
              >
                <option aria-label="None" value="">
                    กรุณาเลือกข้อมูลประวัติผู้ที่เคยยืมหนังสือ
                </option>
                {borrowbook.map((item: BorrowBookInterface) => (
                    <option value={item.ID} key={item.ID}>
                      ชื่อ: {item.User.Name} | 
                      เลขบัตรประชาชน: {item.User.Idcard} | 
                      ชื่อหนังสือ: {item.BookPurchasing.BookName} | 
                      หมวดหมู่: {item.BookPurchasing.BookCategory.Name} | 
                      เเถบสี: {item.Color_Bar} |
                      วันกำหนดคืน: {DateFormat(item.Return_Day)}
                    </option>  //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>



          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <b><p>จำนวนวันเลยกำหนดคืน(วัน)</p></b>
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
              <b><p>หนังสือหาย(หาย/ไม่หาย)</p></b>
              <Select
                // id="LostBookID"
                native
                value={returnbook.LostBookID}
                onChange={handleChange}
                inputProps={{
                  name: "LostBookID", //เอาไว้เข้าถึงข้อมูล LostBookID
                }}
              >
                <option aria-label="None" value="">
                    กรุณาเลือกหนังสือหายหรือไม่
                </option>
                {lostbook.map((item: LostBookInterface) => (
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
              <b><p>สภาพหนังสือ</p></b>
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
              <b><p>วันที่คืนหนังสือ</p></b>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
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
              <b><p>บรรณารักษ์ผู้บันทึกข้อมูล</p></b>
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
            <Button component={RouterLink} to="/returnbook" variant="contained">
              กลับ
            </Button>

            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="warning"
            >
              บันทึกข้อมูล
            </Button>
          </Grid>
        </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default ReturnBookCreate;
