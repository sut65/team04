import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";

// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// import ChevronRightIcon from "@material-ui/icons/ChevronRight";
// import PlanningCreate from "./components/PlanningCreate";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Loging from "./components/Login";
import { Grid } from "@material-ui/core";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SaveIcon from "@mui/icons-material/Save";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import Home from "./components/Home";
// import Nutritionists from "./components/Nutritionists";
// import NutritionistCreate from "./components/NutritionistCreate";
// import FoodInformations from "./components/FoodInformations";
// import FoodInformationCreate from "./components/FoodInformationCreate";
// import Limits from "./components/Limits";
// import LimitCreate from "./components/LimitCreate";
import SignInLibrarian from "./components/SignInLibrarian";
import { LibrarianInterface } from "./models/ILibrarian";

import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import { AssignmentLateOutlined } from "@mui/icons-material";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
// import Tracking from "./components/Tracking";
// import TrackingCreate from "./components/TrackingCreate";
// import Patient from "./components/Patient";
// import PatientCreate from "./components/PatientCreate";
// import Plannings from "./components/Planning";
// import FoodSickness from "./components/FoodSickness";
// import FoodSicknessCreate from "./components/FoodSicknessCreate";

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    title: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    a: {
      textDecoration: "none",
      color: "inherit",
    },
  })
);

export default function MiniDrawer() {
  const [librarians, setLibrarians] = useState<Partial<LibrarianInterface>>({});
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState<String>("");
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuLibrarian = [
    { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },
    {
      name: "ระบบบันทึกข้อมูลอาหาร",
      icon: <MenuBookIcon />,
      path: "/foodsicknesses",
    },
    // {
    //   name: "ระบบบันทึกสารอาหาร",
    //   icon: <SaveIcon />,
    //   path: "/food_informations",
    // },
    // {
    //   name: "ระบบบันทึกข้อจำกัดการบริโภคอาหารของผู้ป่วย",
    //   icon: <AssignmentLateOutlined />,
    //   path: "/Limits",
    // },
    // {
    //   name: "ระบบวางแผนรายการอาหาร",
    //   icon: <FoodBankIcon />,
    //   path: "/planning",
    // },
    // {
    //   name: "ระบบประเมินภาวะโภชนาการหลังบริโภคอาหารของผู้ป่วย",
    //   icon: <PlaylistAddCheckCircleIcon />,
    //   path: "/tracking",
    // },
  ];
  const menuUser = [
    { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },
    // {
    //   name: "ระบบบันทึกข้อมูลผู้ป่วย",
    //   icon: <PeopleIcon />,
    //   path: "/patients",
    // },
    {
      name: "ระบบบันทึกข้อมูลนักโภชนาการ",
      icon: <AccountCircleIcon />,
      path: "/nutritionists",
    },
  ];
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getLibrarians = async () => {
    let uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/librarians/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setLibrarians(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getLibrarians();
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  if (!token) {
    return <Loging />;
  }

  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        {token && (
          <>
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
              })}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton, {
                    [classes.hide]: open,
                  })}
                >
                  <MenuIcon />
                </IconButton>
                {localStorage.getItem("uid") ? (
                  <Typography variant="h6" className={classes.title}>
                    ระบบห้องสมุด(สำหรับผู้ใช้งานทั่วไป)
                  </Typography>
                ) : (
                  <Typography variant="h6" className={classes.title}>
                    ระบบห้องสมุด(สำหรับบรรณารักษ์)
                  </Typography>
                )}

                <Grid item xs={2}>
                  <Typography className={classes.title}>
                    {librarians?.Email}
                  </Typography>
                </Grid>

                <Button color="inherit" onClick={signout}>
                  ออกจากระบบ
                </Button>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              })}
              classes={{
                paper: clsx({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
                }),
              }}
            >
              <div className={classes.toolbar}>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </div>
              <Divider />
              <List>
                {localStorage.getItem("uid")
                  ? menuUser.map((item, index) => (
                      <Link
                        to={item.path}
                        key={item.name}
                        className={classes.a}
                      >
                        <ListItem button>
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.name} />
                        </ListItem>
                      </Link>
                    ))
                  : menuLibrarian.map((item, index) => (
                      <Link
                        to={item.path}
                        key={item.name}
                        className={classes.a}
                      >
                        <ListItem button>
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.name} />
                        </ListItem>
                      </Link>
                    ))}
              </List>
            </Drawer>
          </>
        )}

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/nutritionists" element={<Nutritionists />} />
              <Route
                path="/nutritionist/create"
                element={<NutritionistCreate />}
              /> */}
              {/* <Route path="/patients" element={<Patient />} />
              <Route path="/patients/create" element={<PatientCreate />} />
              <Route path="/food_informations" element={<FoodInformations />} />
              <Route
                path="/food_information/create"
                element={<FoodInformationCreate />}
              />
              <Route path="/foodsicknesses" element={<FoodSickness />} />
              <Route
                path="/foodsicknesses/create"
                element={<FoodSicknessCreate />}
              />
              <Route path="/Limits" element={<Limits />} />
              <Route path="/Limit/create" element={<LimitCreate />} />
              <Route path="/planning" element={<Plannings />} />
              <Route path="/planning/create" element={<PlanningCreate />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/trackingcreate" element={<TrackingCreate />} /> */}
            </Routes>
          </div>
        </main>
      </Router>
    </div>
  );
}
