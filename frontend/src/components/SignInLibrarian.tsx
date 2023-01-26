import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { SigninInterface } from "../models/ISignin";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignIn() {
  const classes = useStyles();
  const [signin, setSignin] = useState<Partial<SigninInterface>>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const login = () => { //เพื่อเป็นการรีเควสกับ backend ว่า user ที่ส่งไปใหม่กับที่มีในดาต้าเบสตรงกันมั้ย
    const apiUrl = "http://localhost:8080/loginLibrarian";
    const requestOptions = { //ประกาศว่าเราจะรีเควสกับ back ด้วยฟังก์ชันแบบไหน
      method: "POST", //เพราะมีการส่งข้อมูลระหว่าง backend กับ frontend
      headers: { "Content-Type": "application/json" }, //หน้าข้างนอกสุด
      body: JSON.stringify(signin),
    };
    fetch(apiUrl, requestOptions)
      .then((response) => response.json()) //ส่งไปให้ backend แล้วก็ต้องการการตอบกลับ
      .then((res) => {
        if (res.data) { //ฝั่ง frontend ได้รับดาต้าที่ส่งมามั้ย (เช็คที่ฝั่ง frontend)
          //login สำเร็จ
          setSuccess(true);
          localStorage.setItem("token", res.data.token); // localStorage เป็นการเก็บข้อมูลของ frontend คล้ายๆคุกกี้
          localStorage.setItem("nid", res.data.id);
          window.location.reload();
        } else {
          setError(true);
        }
      });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof signin;
    const { value } = event.target;
    setSignin({ ...signin, [id]: value });
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          เข้าสู่ระบบสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          อีเมลหรือรหัสผ่านไม่ถูกต้อง
        </Alert>
      </Snackbar>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
        Librarian
        </Typography>

        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Email"
            label="Email Address"
            name="Email"
            autoComplete="email"
            autoFocus
            value={signin.Email || ""}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Password"
            label="Password"
            type="password"
            id="Password"
            autoComplete="current-password"
            value={signin.Password || ""}
            onChange={handleInputChange}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={login}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default SignIn;
