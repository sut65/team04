import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Select from "@material-ui/core/Select";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MenuItem from "@mui/material/MenuItem";
import { ReturnBookInterface } from "../models/IReturnBook";
import { PaymentInterface } from "../models/IPayment";
import { LibrarianInterface } from "../models/ILibrarian";
import { ForfeitInterface } from "../models/IForfeit";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ForfeitCreate() {
  //const classes = useStyles();
  const [Pay_Date, setPay_Date] = useState<Date | null>(null);
  const [returnBook, setReturnBook] = useState<ReturnBookInterface[]>([]);
  const [payment, setPayment] = useState<PaymentInterface[]>([]);
  const [librarian, setLibrarian] = useState<LibrarianInterface[]>([]);
  const [forfeit, setForfeit] = useState<Partial<ForfeitInterface>>({}); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccess(false);

    setError(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof ForfeitCreate;

    const { value } = event.target;

    setForfeit({ ...forfeit, [id]: value });
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }>
  ) => {
    const name = event.target.name as keyof typeof forfeit;
    setForfeit({
      ...forfeit,
      [name]: event.target.value,
    });
  };

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      ReturnBookID: forfeit.ReturnBookID,
      Pay: convertType(forfeit.Pay),
      PaymentID: convertType(forfeit.PaymentID),
      Pay_Date: new Date(),
      Note: forfeit.Note ?? "",
      LibrarianID: Number(localStorage.getItem("nid")),
    };
    console.log(data);

    const apiUrl = "http://localhost:8080/forfeit";
    const requestOptionsPost = {
      method: "POST", //เอาข้อมูลไปเก็บไว้ในดาต้าเบส
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuccess(true);
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

  const getLibrarian = async () => {
    const apiUrl = "http://localhost:8080/librarian";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setLibrarian(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getPayment = async () => {
    const apiUrl = "http://localhost:8080/payment";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setPayment(res.data);
        }
      });
  };

  const getReturnBook = async () => {
    const apiUrl = `http://localhost:8080/return_books`; //เราจะใช้เอพีไอจากตารางแพลนนิ่งไอดีโดยจะอ้างอิงชื่อผู้ป่วยจากเพเชี่ยนไอดี

    fetch(apiUrl, requestOptions)
      .then((response) => response.json()) //เปลี่ยนจากเจสันเป็นจาว่าสคริปต์
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setReturnBook(res.data);
        }
      });
  };

  useEffect(() => {
    getLibrarian();
    getPayment();
    getReturnBook();
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
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              บันทึกการบันทึกค่าปรับ
            </Typography>
          </Box>
        </Box>

        <Divider />
        <Grid container spacing={3} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="standard">
              <Typography variant="inherit">
                จำนวนรายการที่เหลือ {returnBook.length} รายการ
              </Typography>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>ชื่อผู้ยืมหนังสือ</p>

              <Select
                // id="ReturnBookID"
                value={forfeit.ReturnBookID}
                onChange={handleChange}
                inputProps={{
                  name: "ReturnBookID", //เอาไว้เข้าถึงข้อมูล ReturnBook ไอดี
                }}
              >
                {returnBook.map(
                  (
                    item: ReturnBookInterface //map
                  ) => (
                    <MenuItem value={item.ID} key={item.ID}>
                      {item.BorrowBook.User.Name} 
                    </MenuItem> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อหนังสือ</p>
              <Select
                native
                disabled
                value={forfeit.ReturnBookID}
              >
                <option aria-label="None" value=""></option>
                {returnBook.map((item: ReturnBookInterface ) => (
                    <option value={item.ID} key={item.ID}>
                      {item.BorrowBook.BookPurchasing.BookName} 
                    </option> //key ไว้อ้างอิงว่าที่1ชื่อนี้ๆๆ value: เก็บค่า
                  )
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>การทำหนังสือหาย</p>
              <Select
                native
                disabled
                value={forfeit.ReturnBookID} //import Snackbar from "@material-ui/core/Snackbar";
              >
                <option aria-label="None" value="" />
                {returnBook.map((item: ReturnBookInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.LostBook.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>จำนวนวันที่เกินกำหนดการคืน</p>
              <Select
                native
                disabled
                value={forfeit.ReturnBookID} //import Snackbar from "@material-ui/core/Snackbar";
              >
                <option aria-label="None" value="" />
                {returnBook.map((item: ReturnBookInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Late_Number}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>เงินค่าปรับ</p>
              <TextField
                id="Pay"
                variant="standard"
                type="number"
                size="medium"
                value={forfeit.Pay || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วิธีการชำระเงิน</p>
              <Select
                native
                value={forfeit.PaymentID}
                onChange={handleChange}
                inputProps={{
                  name: "PaymentID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกวิธีการชำระเงิน
                </option>
                {payment.map((item: PaymentInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>หมายเหตุ</p>
              <TextField
                id="Note"
                variant="standard"
                type="string"
                size="medium"
                value={forfeit.Note || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>วันที่และเวลาบันทึกข้อมูล</p>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  disabled
                  value={Pay_Date}
                  onChange={(newValue) => {
                    setPay_Date(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ผู้บันทึกข้อมูล</p>
              <Select
                disabled={true}
                value={localStorage.getItem("nid")}
                // onChange={handleChange}
                // inputProps={{
                //   name: "StaffID",
                // }}
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
              to="/forfeit/info"
              variant="contained"
              color="inherit"
            >
              กลับ
            </Button>
            <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
              color="primary"
            >
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ForfeitCreate;
