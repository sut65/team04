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
import { DatePicker } from "@mui/x-date-pickers";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useEffect, useState } from "react";
import { BookPurchasingInterface } from "../models/IBookPurchasing";
import { LibrarianInterface } from "../models/ILibrarian";
import { BookCategoryInterface } from "../models/IBookCategory";
import { PublisherInterface } from "../models/IPublisher";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function BookPurchasingCreate() {
  const [date, setDate] = useState<Date | null>();
  const [bookpurchasing, setBookPurchasing] = useState<
    Partial<BookPurchasingInterface>
  >({}); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [bookcategory, setBookCategory] = useState<BookCategoryInterface[]>([]);
  const [publisher, setPublisher] = useState<PublisherInterface[]>([]);
  const [librarian, setLibrarian] = useState<LibrarianInterface[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const id = event.target.id as keyof typeof bookpurchasing; //
    // console.log(event.target.id);
    // console.log(event.target.value);

    const { value } = event.target;

    setBookPurchasing({ ...bookpurchasing, [id]: value });
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ name และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof bookpurchasing; //
    console.log("name", event.target.name);
    console.log("value", event.target.value);

    const { value } = event.target;

    setBookPurchasing({ ...bookpurchasing, [name]: value });
  };

  function submit() {
    let data = {
      //เก็บข้อมูลที่จะเอาไปเก็บในดาต้าเบส
      BookName: bookpurchasing.BookName ?? "",
      AuthorName: bookpurchasing.AuthorName ?? "",
      Amount: Number(bookpurchasing.Amount) ?? "",
      Date: date?.toISOString(),
      BookCategoryID: Number(bookpurchasing.BookCategoryID),
      PublisherID: Number(bookpurchasing.PublisherID),
      LibrarianID: Number(localStorage.getItem("nid")),
    };
    console.log(data);

    const apiUrl = "http://localhost:8080/bookPurchasingCreate";
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
          console.log("บันทึกได้");
          setSuccess(true);
          setErrorMessage("");
        } else {
          console.log("บันทึกไม่ได้");
          setError(true);
          setErrorMessage(res.error);
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
  const GetAllPublisher = async () => {
    const apiUrl = "http://localhost:8080/publisher";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setPublisher(res.data);
        }
      });
  };

  const GetAllBookCategory = async () => {
    const apiUrl = "http://localhost:8080/bookCategory";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setBookCategory(res.data);
        } else {
          console.log(res.err);
        }
      });
  };

  const GetAllLibrarian = async () => {
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
  useEffect(() => {
    //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
    //ไม่ให้รันแบบอินฟินิตี้ลูป
    GetAllBookCategory();
    GetAllPublisher();
    GetAllLibrarian();
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
              บันทึกการสั่งซื้อหนังสือ
            </Typography>
          </Box>
        </Box>

        <Divider />
        <Grid container spacing={3} sx={{ padding: 2 }}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>ชื่อหนังสือ</p>
              <TextField
                id="BookName"
                variant="standard"
                type="string"
                size="medium"
                value={bookpurchasing.BookName || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>ประเภทหนังสือ</p>

              <Select
                native
                value={bookpurchasing.BookCategoryID}
                onChange={handleChange}
                inputProps={{
                  name: "BookCategoryID", //เอาไว้เข้าถึงข้อมูล
                }}
              >
                <option aria-label="None" value=""></option>
                {bookcategory.map(
                  (
                    item: BookCategoryInterface //map
                  ) => (
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
              <p>ชื่อผู้แต่ง</p>
              <TextField
                id="AuthorName"
                variant="standard"
                type="string"
                size="medium"
                value={bookpurchasing.AuthorName || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>สำนักพิมพ์</p>

              <Select
                native
                value={bookpurchasing.PublisherID}
                onChange={handleChange}
                inputProps={{
                  name: "PublisherID", //เอาไว้เข้าถึงข้อมูลแพลนนิ่งไอดี
                }}
              >
                <option aria-label="None" value=""></option>
                {publisher.map(
                  (
                    item: PublisherInterface //map
                  ) => (
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
              <p>จำนวน (เล่ม)</p>
              <TextField
                id="Amount"
                variant="standard"
                type="number"
                size="medium"
                value={bookpurchasing.Amount || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>ผู้บันทึกข้อมูล</p>

              <Select
                disabled={true} //เป็นจางๆไม่ให้เปลี่ยน
                value={localStorage.getItem("nid")}
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
            <FormControl fullWidth variant="standard">
              <p>วันที่บันทึกข้อมูล</p>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/bookPurchasing"
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
              บันทึกการจัดซื้อ
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default BookPurchasingCreate;
