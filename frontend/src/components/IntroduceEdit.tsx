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
import { DateTimePicker } from "@mui/x-date-pickers";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useEffect, useState } from "react";
import { BookTypeInterface } from "../models/IBookType";
import { ObjectiveInterface } from "../models/IObjective";
import { UserInterface } from "../models/IUser";
import { IntroduceInterface } from "../models/IIntroduce";
import { type } from "os";
import Introduce from "./Introduce";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Introduce {
  Cancle: () => void;
  Data: IntroduceInterface | undefined;
}

function IntroduceEdit({ Cancle, Data }: Introduce) {
  const [I_Date, setI_Date] = useState<Date | null>();
  const [introduce, setIntroduce] = useState<Partial<IntroduceInterface>>({
    ID: Data?.ID,
    Title: Data?.Title,
    Author: Data?.Author,
    ISBN: Data?.ISBN,
    Edition: Data?.Edition,
    Pub_Name: Data?.Pub_Name,
    Pub_Year: Data?.Pub_Year,
    BookTypeID: Data?.BookTypeID,
    ObjectiveID: Data?.ObjectiveID,
    I_Date: Data?.I_Date,
    UserID: Data?.UserID,
  }); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [objective, setObjective] = useState<ObjectiveInterface[]>([]);
  const [bookType, setBookType] = useState<BookTypeInterface[]>([]);
  const [users, setUsers] = useState<UserInterface[]>([]);
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
    const id = event.target.id as keyof typeof introduce; //
    // console.log(event.target.id);
    // console.log(event.target.value);

    const { value } = event.target;

    setIntroduce({ ...introduce, [id]: value });
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ name และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof introduce; //
    console.log("name", event.target.name);
    console.log("value", event.target.value);

    const { value } = event.target;

    setIntroduce({ ...introduce, [name]: value });
  };

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      ID: Number(introduce.ID),
      Title: introduce.Title ?? "",
      Author: introduce.Author ?? "",
      ISBN: introduce.ISBN ?? "",
      Edition: convertType(introduce.Edition),
      Pub_Name: introduce.Pub_Name ?? "",
      Pub_Year: introduce.Pub_Year ?? "",
      BookTypeID: convertType(introduce.BookTypeID),
      ObjectiveID: convertType(introduce.ObjectiveID),
      I_Date: new Date(),
      UserID: Number(localStorage.getItem("uid")),
    };
    console.log(data);

    const apiUrl = "http://localhost:8080/introduce";
    const requestOptions = {
      method: "PATCH", //เอาข้อมูลไปเก็บไว้ในดาต้าเบส
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
          window.location.reload();
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

  const GetAllBookType = async () => {
    const apiUrl = "http://localhost:8080/bookType";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setBookType(res.data);
        }
      });
  };

  const GetAllObjective = async () => {
    const apiUrl = "http://localhost:8080/objective";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setObjective(res.data);
        }
      });
  };

  const GetAllUser = async () => {
    const apiUrl = "http://localhost:8080/users";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setUsers(res.data);
        }
      });
  };
  useEffect(() => {
    //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
    //ไม่ให้รันแบบอินฟินิตี้ลูป
    GetAllObjective();
    GetAllBookType();
    GetAllUser();
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
            marginTop: 2
          }}
        >
          <Box sx={{ paddingX: 3, paddingY: 1 }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              บันทึกการแนะนำหนังสือ
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Paper sx={{bgcolor: "#BFEFFF", spacing: 5, padding: 4, marginBottom: 1}}>
          
          &emsp;  กรุณากรอก <b>ชื่อหนังสือ</b> ที่ต้องการแนะนำ !! <br /><br />
          &emsp;  ในกรณีที่ไม่ทราบชื่อผู้แต่ง , สำนักพิมพ์ , ปีที่พิมพ์ ให้กรอกว่า <b> ไม่ทราบ </b><br /><br />
          &emsp;  เลข ISBN จะต้องเป็นเลขขึ้นต้นด้วย 978 และ 979 ที่ตามด้วยตัวเลขอีก 10 ตัวเท่านั้น <br /><br />
          &emsp;  ในกรณีที่ไม่ทราบครั้งที่ตีพิมพ์ ให้กรอกเป็นตีพิมพ์ครั้งที่ <b> 1 </b><br />
          
        </Paper>

        <Grid container spacing={3} sx={{ padding: 2 }}>

          <Grid item xs={12}>
            <FormControl fullWidth variant="standard">
              <p>ชื่อเรื่อง</p>
              <TextField
                id="Title"
                variant="standard"
                type="string"
                size="medium"
                value={introduce.Title || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>ชื่อผู้แต่ง</p>
              <TextField
                id="Author"
                variant="standard"
                type="string"
                size="medium"
                value={introduce.Author || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>ISBN</p>
              <TextField
                id="ISBN"
                variant="standard"
                type="string"
                size="medium"
                value={introduce.ISBN|| ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>ตีพิมพ์ครั้งที่</p>
              <TextField
                id="Edition"
                variant="standard"
                type="number"
                size="medium"
                value={introduce.Edition || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>สำนักพิมพ์</p>
              <TextField
                id="Pub_Name"
                variant="standard"
                type="string"
                size="medium"
                value={introduce.Pub_Name || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>ปีที่ตีพิมพ์</p>
              <TextField
                id="Pub_Year"
                variant="standard"
                type="string"
                size="medium"
                value={introduce.Pub_Year || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ประเภท</p>
              <Select
                native
                value={introduce.BookTypeID}
                onChange={handleChange}
                inputProps={{
                  name: "BookTypeID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกประเภท
                </option>
                {bookType.map((item: BookTypeInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วัตถุประสงค์</p>
              <Select
                native
                value={introduce.ObjectiveID + ""}
                onChange={handleChange}
                inputProps={{
                  name: "ObjectiveID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกวัตถุประสงค์
                </option>
                {objective.map((item: ObjectiveInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <p>วันที่และเวลาบันทึกข้อมูล</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  disabled
                  value={I_Date}
                  onChange={(newValue) => {
                    setI_Date(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ผู้แนะนำหนังสือ</p>
              <Select
                disabled={true}
                value={localStorage.getItem("uid")}
                // onChange={handleChange}
                // inputProps={{
                //   name: "StaffID",
                // }}
              >
                {users.map(
                  (
                    item: UserInterface //map
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
              onClick={Cancle}
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

export default IntroduceEdit;
