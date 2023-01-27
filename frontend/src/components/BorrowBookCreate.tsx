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
import { LibrarianInterface } from "../models/ILibrarian";
import { BookPurchasingInterface } from "../models/IBookPurchasing";
import { BorrowBookInterface } from "../models/IBorrowBook";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function BorrowBookCreate() {
  const [borb_day, setBorb_Day] = useState<Date | null>();
  const [return_day, setReturn_Day] = useState<Date | null>();
  const [borrowbook, setBorrowBook] = useState<Partial<BorrowBookInterface>>(
    {}
  ); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
  const [bookpurchasing, setBookPurchasing] = useState<
    BookPurchasingInterface[]
  >([]);
  const [user, setUser] = useState<UserInterface[]>([]);
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
    console.log(event.target.name);
    console.log(event.target.value);

    const { value } = event.target;

    setBorrowBook({ ...borrowbook, [name]: value });
  };

  function submit() {
    let data = {
      //เก็บข้อมูลที่จะเอาไปเก็บในดาต้าเบส
      Borb_Day: new Date(),
      Return_Day: new Date(),
      Color_Bar: borrowbook.Color_Bar ?? "",
      Borb_Frequency: borrowbook.Borb_Frequency ?? "",
      // Borb_Frequency:   convertType(borrowbook.Borb_Frequency),
      UserID: borrowbook.UserID,
      BookPurchasingID: borrowbook.BookPurchasingID,
      LibrarianID: Number(localStorage.getItem("nid")),
    };
    console.log(data);

    const apiUrl = "http://localhost:8080/borrow_books";
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
          getBookPurchasing();
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
              บันทึกการยืมหนังสือ
            </Typography>
          </Box>
        </Box>
        <Divider />

        <Grid container spacing={3} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="standard">
              <p>ผู้ยืมหนังสือ</p>
              <Select
                // id="UserID"
                value={borrowbook.UserID}
                onChange={handleChange}
                inputProps={{
                  name: "UserID", //เอาไว้เข้าถึงข้อมูลuserไอดี
                }}
              >
                {user.map(
                  (
                    item: UserInterface //map
                  ) => (
                    <MenuItem value={item.ID} key={item.ID}>
                      ชื่อ: {item.Name} | เลขบัตรประชาชน: {item.Idcard}
                    </MenuItem> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="standard">
              <p>ชื่อเเละหมวดหมู่ของหนังสือที่ยืม</p>
              <Select
                // id="BookPurchasingID"
                value={borrowbook.BookPurchasingID}
                onChange={handleChange}
                inputProps={{
                  name: "BookPurchasingID", //เอาไว้เข้าถึงข้อมูล BookPurchasingID
                }}
              >
                {bookpurchasing.map(
                  (
                    item: BookPurchasingInterface //map
                  ) => (
                    <MenuItem value={item.ID} key={item.ID}>
                      {item.BookName} | หมวดหมู่หนังสือ:{" "}
                      {item.BookCategory.Name}
                    </MenuItem> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>เเถบสีหนังสือ</p>
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
              <p>จำนวนครั้งที่ยืมหนังสือ</p>
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
              <p>วันที่ยืมหนังสือ</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  disabled
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
              <p>วันกำหนดคืนหนังสือ</p>
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

export default BorrowBookCreate;
