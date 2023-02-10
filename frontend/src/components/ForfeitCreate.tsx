import React, { useEffect, useState } from "react";
import { Link as RouterLink , useParams} from "react-router-dom";
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
  let { id } = useParams();
  const [Pay_Date, setPay_Date] = useState<Date | null>();
  const [returnBook, setReturnBook] = useState<ReturnBookInterface[]>([]);
  const [payment, setPayment] = useState<PaymentInterface[]>([]);
  const [librarian, setLibrarian] = useState<LibrarianInterface[]>([]);
  const [forfeit, setForfeit] = useState<Partial<ForfeitInterface>>({}); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setSuccess(false);

  //   setError(false);
  // };

  // const handleInputChange = (
  //   event: React.ChangeEvent<{ id?: string; value: any }>
  // ) => {
  //   const id = event.target.id as keyof typeof ForfeitCreate;

  //   const { value } = event.target;

  //   setForfeit({ ...forfeit, [id]: value });
  // };

  // const handleChange = (
  //   event: React.ChangeEvent<{ name?: string; value: any }>
  // ) => {
  //   const name = event.target.name as keyof typeof forfeit;
  //   setForfeit({
  //     ...forfeit,
  //     [name]: event.target.value,
  //   });
  // };
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
    const id = event.target.id as keyof typeof forfeit; //
    // console.log(event.target.id);
    // console.log(event.target.value);

    const { value } = event.target;

    setForfeit({ ...forfeit, [id]: value });
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ name และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof forfeit; //
    console.log("name", event.target.name);
    console.log("value", event.target.value);

    const { value } = event.target;

    setForfeit({ ...forfeit, [name]: value });
  };

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
        forfeit.LibrarianID = res.ID;
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
    const apiUrl = `http://localhost:8080/returnBookNoForfeitCheck`; //เราจะใช้เอพีไอจากตาราง returnBook ไอดีโดยจะอ้างอิงชื่อผู้ยืมหนังสือจาก BookPurchasingCreate ไอดี

    fetch(apiUrl, requestOptions)
      .then((response) => response.json()) //เปลี่ยนจากเจสันเป็นจาว่าสคริปต์
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setReturnBook(res.data);
        }
      });
  };

  //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
  //ไม่ให้รันแบบอินฟินิตี้ลูป
  useEffect(() => {
    getLibrarian();
    getPayment();
    getReturnBook();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      ReturnBookID: convertType(forfeit.ReturnBookID),
      Pay: convertType(forfeit.Pay),
      PaymentID: convertType(forfeit.PaymentID),
      Pay_Date: new Date(),
      Note: forfeit.Note ?? "",
      ModulateNote: forfeit.ModulateNote ?? "",
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
          บันทึกข้อมูลสำเร็จ
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
          บันทึกข้อมูลไม่สำเร็จ : {errorMessage}
        </Alert>
      </Snackbar>

      <Paper sx={{bgcolor: "#E0FFFF"}}>
        <Box
          display="flex"
          sx={{
            bgcolor: "#4682B4", marginTop: 2
          }}
        >
          <Box sx={{ paddingX: 3, paddingY: 1 }}>
            <Typography
              component="h2"
              variant="h6"
              color="#E0FFFF"
              gutterBottom
            >
              บันทึกการบันทึกค่าปรับ
            </Typography>
          </Box>
        </Box>

        <Divider />
        
        <Paper sx={{bgcolor: "#BFEFFF", spacing: 5, padding: 4, marginBottom: 1}}>
          
          ห้องสมุดได้คิดอัตราค่าปรับไว้ดังนี้ <br />
          &emsp;  - หนังสือทั่วไป ปรับวันละ 5 บาท ต่อเล่ม/วัน <br />
          &emsp;  - หนังสือหนังสือสำรอง ปรับวันละ 10 บาท ต่อเล่ม/วัน <br />
          <br />
          <b>ในกรณีที่ทำหนังสือสูญหาย</b><br />
          &emsp;  - <b>กรณีที่ 1</b> หากผู้เข้าใช้ห้องสมุด หาซื้อหนังสือมาคืนห้องสมุด จะคิดแค่ค่าดำเนินการ 100 บาท  <br />
          &emsp;&emsp;   * หนังสือที่ซื้อมาคืนต้องพิมพ์ครั้งเดียวกันหรือใหม่กว่า * <br />
          &emsp;  - <b>กรณีที่ 2</b> หากหาซื้อคืนไม่ได้ ปรับเป็น 2 เท่าของราคาหนังสือ + ค่าดำเนินการ 100 บาท <br />
          <br />
          / กรณี หนังสือที่ไม่ทราบราคา คิดค่าปรับ 300 บาท + ค่าดำเนินการ 100 บาท /
          
        </Paper>
        <Grid container spacing={3} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="standard">
              <Typography variant="inherit">
                <Paper sx={{bgcolor: "#B0E0E6",  spacing: 3, padding: 2}}>
                  จำนวนรายการที่เหลือ {returnBook.length} รายการ
                </Paper>
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
              <p>ราคาหนังสือ</p>
              <Select
                native
                disabled
                value={forfeit.ReturnBookID}
              >
                <option aria-label="None" value=""></option>
                {returnBook.map((item: ReturnBookInterface ) => (
                    <option value={item.ID} key={item.ID}>
                      {item.BorrowBook.BookPurchasing.Amount} 
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
              <p>การหาหนังสือมาคืน ในกรณีที่ทำหนังสือสูญหาย</p>
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
              <p>การขอลดหย่อน</p>
              <TextField
                id="ModulateNote"
                variant="standard"
                type="string"
                size="medium"
                value={forfeit.ModulateNote || ""}
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
