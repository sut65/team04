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
import { ReceiverInterface } from "../models/IReceiver";
import { ConfirmationInterface } from "../models/IConfirmation";

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

function ConfirmationCreate() {
  const classes = useStyles();
//   const [Librarian, setLibrarian] = useState<Partial<LibrarianInterface>>({});
//   const [User, setUser] = useState<UserInterface[]>([]);
//   const [preorder, setPreorder] = useState<Partial<PreorderInterface>>({});
//   const [Payment, setPayment] = useState<PaymentInterface[]>([]);

  const [preorder, setPreorder] = useState<PreorderInterface[]>([]);
  const [receiver, setReceiver] = useState<ReceiverInterface[]>([]);
  const [confirmation, setConfirmation] = useState<Partial<ConfirmationInterface>>({});

  const [Librarian, setLibrarian] = useState<LibrarianInterface[]>([]);
  const [datetime, setDatetime] = React.useState<Date | null>();

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

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ name และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof confirmation; 
    console.log(event.target.name);
    console.log(event.target.value);

    const { value } = event.target;

    setConfirmation({ ...confirmation, [name]: value });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof ConfirmationCreate;
    const { value } = event.target;
    setConfirmation({ ...confirmation, [id]: value });
  };

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
  const getReceiver = async () => {
    fetch(`${apiUrl}/receiver`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setReceiver(res.data);
        } else {
          console.log("else");
        }
      });
  };

  //user
  const getPreorder = async () => {
    const apiUrl = "http://localhost:8080/preorder";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setPreorder(res.data);
        }
      });
  };

  useEffect(() => {
    //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
    //ไม่ให้รันแบบอินฟินิตี้ลูป
    getLibrarian();
    getReceiver();
    getPreorder();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {

        PreorderID: convertType(confirmation.PreorderID),
        ReceiverID: convertType(confirmation.ReceiverID),

        NoteName: confirmation.NoteName,
        NoteTel: confirmation.NoteTel,
        Datetime: new Date(),
        
        LibrarianID: Number(localStorage.getItem("nid")),
    };

    console.log(data);

    const apiUrl = "http://localhost:8080/confirmation";
    const requestOptions = {
      method: "POST",  
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuccess(true);
        } else {
          setError(true);
        }
      });
  }

  return (
    <Container maxWidth="md">
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
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
              บันทึกการยืนยันการรับหนังสือ
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} sx={{ padding: 2 }}>
        
        <Grid item xs={6}>
            <FormControl variant="standard">
            
            <p>ใบรายการสั่งซื้อ</p>

                <NativeSelect
                    value={confirmation.PreorderID}
                    
                    onChange={handleChange}
                    inputProps={{
                        name: "PreorderID", //เอาไว้เข้าถึงข้อมูลแพลนนิ่งไอดี
                    }}
                    
                    >
                    <option aria-label="None" value="">
                        กรุณาเลือกใบรายการสั่งซื้อ
                    </option>
                    {preorder.map((item: PreorderInterface) => (
                        <option value={item.ID} key={item.ID}>
                        {item.ID} 
                        </option>
                    ))}
                
                </NativeSelect>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl variant="standard">
            <p>สมาชิกห้องสมุด</p>
                <NativeSelect
                    value={confirmation.PreorderID}
                    disabled
                    onChange={handleChange}
                    inputProps={{
                        name: "ProderUserName", //เอาไว้เข้าถึงข้อมูลแพลนนิ่งไอดี
                    }}
                    
                    >
                    <option aria-label="None" value="">
                        {/* กรุณาเลือกเลขบัตรประจำตัวประชาชน */}
                    </option>
                    {preorder.map((item: PreorderInterface) => (
                        <option value={item.ID} key={item.ID}>
                        {item.User.Idcard}, {item.User.Name}, {item.User.Tel} 
                        </option>
                    ))}
                
                </NativeSelect>
            </FormControl>
          </Grid>
            
          <Grid item xs={4}>
            <FormControl variant="standard">
            <p>ชื่อหนังสือ</p>
                <NativeSelect
                    value={confirmation.PreorderID}
                    disabled
                    onChange={handleChange}
                    inputProps={{
                        name: "ProderName", //เอาไว้เข้าถึงข้อมูลแพลนนิ่งไอดี
                    }}
                    
                    >
                    <option aria-label="None" value="">
                        {/* กรุณาเลือกเลขบัตรประจำตัวประชาชน */}
                    </option>
                    {preorder.map((item: PreorderInterface) => (
                        <option value={item.ID} key={item.ID}>
                        {item.Name}
                        </option>
                    ))}
                
                </NativeSelect>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl variant="standard">
            <p>จำนวน</p>
                <NativeSelect
                    value={confirmation.PreorderID}
                    disabled
                    onChange={handleChange}
                    inputProps={{
                        name: "ProderName", //เอาไว้เข้าถึงข้อมูลแพลนนิ่งไอดี
                    }}
                    
                    >
                    <option aria-label="None" value="">
                        {/* กรุณาเลือกเลขบัตรประจำตัวประชาชน */}
                    </option>
                    {preorder.map((item: PreorderInterface) => (
                        <option value={item.ID} key={item.ID}>
                        {item.Quantity}
                        </option>
                    ))}
                
                </NativeSelect>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl variant="standard">
            <p>ราคาทั้งหมด</p>
                <NativeSelect
                    value={confirmation.PreorderID}
                    disabled
                    onChange={handleChange}
                    inputProps={{
                        name: "ProderName", //เอาไว้เข้าถึงข้อมูลแพลนนิ่งไอดี
                    }}
                    
                    >
                    <option aria-label="None" value="">
                        {/* กรุณาเลือกเลขบัตรประจำตัวประชาชน */}
                    </option>
                    {preorder.map((item: PreorderInterface) => (
                        <option value={item.ID} key={item.ID}>
                        {item.Totalprice}
                        </option>
                    ))}
                
                </NativeSelect>
            </FormControl>
          </Grid>
        

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <p>วิธีการรับ</p>
              <NativeSelect
                id="Receiver"
                value={confirmation.ReceiverID}
                onChange={handleChange}
                inputProps={{
                  name: "ReceiverID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกวิธีการรับ
                </option>
                {receiver.map((item: ReceiverInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Type}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Grid>
          
          

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>หมายเหตุชื่อผู้รับ</p>
              <TextField
                id="NoteName"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="กรุณากรอกชื่อผู้รับ"
                value={confirmation.NoteName || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>หมายเหตุเบอร์โทรผู้รับ</p>
              <TextField
                id="NoteTel"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="กรุณากรอกเบอร์โทรผู้รับ"
                value={confirmation.NoteTel || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>วันที่เวลาที่ส่งมอบ</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
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
              <p>ผู้ทำการส่งมอบ</p>

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
              component={RouterLink}
              to="/confirmation"
              variant="contained"
              color="inherit"
            >
              ย้อนกลับ
            </Button>
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="primary"
            >
              บันทึกข้อมูล
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ConfirmationCreate;
