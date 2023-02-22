import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material//Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import Select from "@material-ui/core/Select";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { NativeSelect } from "@mui/material";
import { UserInterface } from "../models/IUser";
import { PreorderInterface } from "../models/IPreorder";
import { PaymentInterface } from "../models/IPayment";
import { LibrarianInterface } from "../models/ILibrarian";

import Preorder from "./Preorder";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);
interface Preorder {
    Cancle: () => void;
    Data: PreorderInterface | undefined;
}

  
function EditPreorder({ Cancle, Data }: Preorder) {
  const [User, setUser] = useState<UserInterface[]>([]);
  const [Payment, setPayment] = useState<PaymentInterface[]>([]);
  const [Librarian, setLibrarian] = useState<LibrarianInterface[]>([]);
  const [datetime, setDatetime] = React.useState<Date | null>(new Date());

  const [preorder, setPreorder] = useState<Partial<PreorderInterface>>({
    ID: Data?.ID,
    UserID: Data?.UserID,
    Name: Data?.Name,
    Price: Data?.Price,
    Author: Data?.Author,
    Edition: Data?.Edition,
    Year: Data?.Year,
    Quantity: Data?.Quantity,
    Totalprice: Data?.Totalprice,
    PaymentID: Data?.PaymentID,
    Datetime: Data?.Datetime,
    LibrarianID: Data?.LibrarianID,
  });

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

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ name และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof preorder; 
    // console.log(event.target.name);
    // console.log(event.target.value);

    const { value } = event.target;

    setPreorder({ ...preorder, [name]: value });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof EditPreorder;
    const { value } = event.target;
    setPreorder({ ...preorder, [id]: value });
  };

  function submit() {
    let data = {
        ID: Number(preorder.ID),
        UserID: Number(preorder.UserID),
        Name: preorder.Name,
        Price: Number(preorder.Price),
        Author: preorder.Author,
        Edition: Number(preorder.Edition),
        Year: preorder.Year,
        Quantity: Number(preorder.Quantity),
        Totalprice: Number(preorder.Totalprice), 
        PaymentID: Number(preorder.PaymentID),
        Datetime:  datetime,
        LibrarianID: Number(localStorage.getItem("nid")),
    };

    console.log(data);

    const apiUrl = "http://localhost:8080/preorder";
    const requestOptions = {
      method: "PATCH",  
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  }; 

  //librarian
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


  //payment
  const getPayment = async () => {
    fetch(`${apiUrl}/payment`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setPayment(res.data);
        } else {
          console.log("else");
        }
      });
  };

  //user
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
    getLibrarian();
    getPayment();
    getUser();
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
        onClose={handleClose}>
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
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              แก้ไขข้อมูลใบรายการคำสั่งซื้อหนังสือ ลำดับที่ {preorder.ID}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} sx={{ padding: 2 }}>
        
        <Grid item xs={6}>
            <FormControl variant="standard">
            
            <p>เลขบัตรประจำตัวประชาชน</p>

                <NativeSelect
                    value={preorder.UserID}
                    
                    onChange={handleChange}
                    inputProps={{
                        name: "UserID", //เอาไว้เข้าถึงข้อมูลแพลนนิ่งไอดี
                    }}
                    
                    >
                    <option aria-label="None" value="">
                        กรุณาเลือกเลขบัตรประจำตัวประชาชน
                    </option>
                    {User.map((item: UserInterface) => (
                        <option value={item.ID} key={item.ID}>
                        {item.Idcard} 
                        </option>
                    ))}
                
                </NativeSelect>
            </FormControl>
          </Grid>
            
          <Grid item xs={6}>
            <FormControl variant="standard">
            <p>ข้อมูลสมาชิก</p>
                <NativeSelect
                    value={preorder.UserID}
                    disabled
                    onChange={handleChange}
                    inputProps={{
                        name: "UserName", //เอาไว้เข้าถึงข้อมูลแพลนนิ่งไอดี
                    }}
                    
                    >
                    <option aria-label="None" value="">
                        {/* กรุณาเลือกเลขบัตรประจำตัวประชาชน */}
                    </option>
                    {User.map((item: UserInterface) => (
                        <option value={item.ID} key={item.ID}>
                        {item.Name} , {item.Tel} 
                        </option>
                    ))}
                
                </NativeSelect>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อหนังสือ</p>
              <TextField
                id="Name"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="กรุณากรอกชื่อหนังสือ"
                value={preorder.Name || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>จำนวนเล่ม</p>
              <TextField
                id="Quantity"
                variant="outlined"
                InputProps={{ inputProps: { min: 0 , max: 5} }}
                type="number"
                placeholder="กรุณากรอกจำนวนเล่ม"
                size="medium"
                rows={2}
                value={preorder.Quantity || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อผู้แต่ง</p>
              <TextField
                id="Author"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="กรุณากรอกชื่อผู้แต่ง"
                value={preorder.Author || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>การพิมพ์ครั้งที่</p>
              <TextField
                id="Edition"
                variant="outlined"
                InputProps={{ inputProps: { min: 0  }}}
                type="number"
                placeholder="กรุณากรอกการพิมพ์ครั้งที่"
                size="medium"
                rows={2}
                value={preorder.Edition || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ปีที่พิมพ์</p>
              <TextField
                id="Year"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="กรุณากรอกปีที่พิมพ์"
                value={preorder.Year || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ราคาหนังสือ</p>
              <TextField
                id="Price"
                variant="outlined"
                InputProps={{ inputProps: { min: 0 } }}
                type="number"
                placeholder="กรุณากรอกราคาหนังสือ"
                size="medium"
                rows={2}
                value={preorder.Price || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ราคารวมทั้งหมด</p>
              <TextField
                id="Totalprice"
                variant="outlined"
                // InputProps={{ inputProps: { min: 0} }}
                placeholder="กรุณากรอกราคารวมทั้งหมด"
                type="number"
                size="medium"
                rows={2}
                value={preorder.Totalprice || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วิธีชำระเงิน</p>
              <NativeSelect
                id="Payment"
                value={preorder.PaymentID}
                onChange={handleChange}
                inputProps={{
                  name: "PaymentID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกวิธีชำระเงิน
                </option>
                {Payment.map((item: PaymentInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>วันที่เวลาที่ทำรายการ</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  disabled
                  value={datetime}
                  onChange={(newValue) => {
                    setDatetime(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>ผู้บันทึกข้อมูล</p>

              <Select
                disabled
                value={localStorage.getItem("nid")}
              >
                {Librarian.map(
                  (
                    item: LibrarianInterface 
                  ) =>                   (
                    <MenuItem value={item.ID} key={item.ID}>
                      {item.Name}
                    </MenuItem> 
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

export default EditPreorder;
