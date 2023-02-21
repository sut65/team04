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
import { DatePicker } from "@mui/x-date-pickers";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useEffect, useState } from "react";
import { BookPurchasingInterface } from "../models/IBookPurchasing";
import { LibrarianInterface } from "../models/ILibrarian";
import { LevelInterface } from "../models/ILevel";
import { BookRepairInterface } from "../models/IBookRepair";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function BookRepairCreate() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [bookrepair, setBookRepair] = useState<Partial<BookRepairInterface>>(
    {}
  ); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [level, setLevel] = useState<LevelInterface[]>([]);
  const [bookpurchasing, setBookPurchasing] = useState<
    BookPurchasingInterface[]
  >([]);
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
    const id = event.target.id as keyof typeof bookrepair; //
    // console.log(event.target.id);
    // console.log(event.target.value);

    const { value } = event.target;

    setBookRepair({ ...bookrepair, [id]: value });
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ name และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof bookrepair; //
    console.log("name", event.target.name);
    console.log("value", event.target.value);

    const { value } = event.target;

    setBookRepair({ ...bookrepair, [name]: value });
  };

  function submit() {
    let data = {
      //เก็บข้อมูลที่จะเอาไปเก็บในดาต้าเบส
      BookPurchasingID: Number(bookrepair.BookPurchasingID),
      LevelID: Number(bookrepair.LevelID),
      Date: date,
      Note: (bookrepair.Note) ?? "",
      LibrarianID: Number(localStorage.getItem("nid")),
    };
    console.log(data);

    const apiUrl = "http://localhost:8080/bookrepair";
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
  const GetAllLevel = async () => {
    const apiUrl = "http://localhost:8080/level";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setLevel(res.data);
        }
      });
  };

  const GetAllBookPurchasing = async () => {
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
    GetAllBookPurchasing();
    GetAllLevel();
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
              บันทึกการแจ้งซ่อมหนังสือ
            </Typography>
          </Box>
        </Box>

        <Divider />
        <Grid container spacing={3} sx={{ padding: 2 }}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <b>
                <p>ชื่อหนังสือที่แจ้งซ่อม</p>
              </b>

              <Select
                value={bookrepair.BookPurchasingID}
                onChange={handleChange}
                inputProps={{
                  name: "BookPurchasingID", //เอาไว้เข้าถึงข้อมูลแพลนนิ่งไอดี
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกชื่อหนังสือที่จะแจ้งซ่อม
                </option>
                {bookpurchasing.map(
                  (
                    item: BookPurchasingInterface //map
                  ) => (
                    <MenuItem value={item.ID} key={item.ID}>
                      {item.BookName}
                    </MenuItem> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>ระดับความเสียหายของหนังสือ</p>

              <Select
                value={bookrepair.LevelID}
                onChange={handleChange}
                inputProps={{
                  name: "LevelID", //เอาไว้เข้าถึงข้อมูลแพลนนิ่งไอดี
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกระดับความเสียหายของหนังสือ
                </option>
                {level.map(
                  (
                    item: LevelInterface //map
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
          <Grid item xs={6}>
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
            <FormControl fullWidth variant="standard">
              <p>หมายเหตุ</p>
              <TextField
                id="Note"
                variant="standard"
                type="string"
                size="medium"
                value={bookrepair.Note || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button component={RouterLink} to="/bookrepair" variant="contained">
              กลับ
            </Button>

            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="success"
            >
              บันทึกการแจ้งซ่อมหนังสือ
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default BookRepairCreate;
