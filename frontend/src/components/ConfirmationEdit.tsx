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

import Confirmation from "./Confirmation";

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

interface Confirmation {
    Cancle: () => void;
    Data: ConfirmationInterface | undefined;
}

function EditConfirmation({ Cancle, Data }: Confirmation) {
  const classes = useStyles();
  const [preorder, setPreorder] = useState<PreorderInterface[]>([]);
  const [receiver, setReceiver] = useState<ReceiverInterface[]>([]);
  const [Librarian, setLibrarian] = useState<LibrarianInterface[]>([]);
  const [datetime, setDatetime] = React.useState<Date | null>();

  const [confirmation, setConfirmation] = useState<Partial<ConfirmationInterface>>({
    ID: Data?.ID,
    PreorderID: Data?.PreorderID,
    ReceiverID: Data?.ReceiverID,
    NoteName: Data?.NoteName,
    NoteTel: Data?.NoteTel,
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
    const name = event.target.name as keyof typeof confirmation; 
    console.log(event.target.name);
    console.log(event.target.value);

    const { value } = event.target;

    setConfirmation({ ...confirmation, [name]: value });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof EditConfirmation;
    const { value } = event.target;
    setConfirmation({ ...confirmation, [id]: value });
  };

  function submit() {
    let data = {
        ID: Number(confirmation.ID),
        PreorderID: convertType(confirmation.PreorderID),
        ReceiverID: convertType(confirmation.ReceiverID),
        NoteName: confirmation.NoteName,
        NoteTel: confirmation.NoteTel,
        Datetime: datetime,
        LibrarianID: Number(localStorage.getItem("nid")),
    };

    console.log(data);

    const apiUrl = "http://localhost:8080/confirmation";
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
          getPreorder();
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

//preorder
  const getPreorder = async () => {
    const apiUrl = `http://localhost:8080/preorder`;

    fetch(apiUrl, requestOptions)
      .then((response) => response.json()) //เปลี่ยนจากเจสันเป็นจาว่าสคริปต์
      .then((res) => {
        console.log("Preorder", res.data);
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

  const DateFormat = (datetime : any) => {
    let dateStyle = new Date(datetime)
    return `${dateStyle.toLocaleDateString("enn-US")}`
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
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              แก้ไขข้อมูลการยืนยันการรับหนังสือ ลำดับที่ {confirmation.ID}
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
            
          <Grid item xs={3}>
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

          <Grid item xs={3}>
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

          <Grid item xs={3}>
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

          <Grid item xs={3}>
            <FormControl variant="standard">
            <p>วันเวลาที่สั่งซื้อ</p>
                <NativeSelect
                    value={confirmation.PreorderID}
                    disabled
                    onChange={handleChange}
                    inputProps={{
                        name: "ProderDatetime", //เอาไว้เข้าถึงข้อมูลแพลนนิ่งไอดี
                    }}
                    
                    >
                    <option aria-label="None" value="">
                        {/* กรุณาเลือกเลขบัตรประจำตัวประชาชน */}
                    </option>
                    {preorder.map((item: PreorderInterface) => (
                        <option value={item.ID} key={item.ID}>
                        {DateFormat(item.Datetime)}
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

export default EditConfirmation;