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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import Home from "./components/Home";
import SignInLibrarian from "./components/SignInLibrarian";
import { LibrarianInterface } from "./models/ILibrarian";
import BookPurchasing from "./components/BookPurchasing";
import BookPurchasingCreate from "./components/BookPurchasingCreate";
import BorrowBook from "./components/BorrowBook";
import ReturnBook from "./components/ReturnBook";
import BorrowBookCreate from "./components/BorrowBookCreate";
import ReturnBookCreate from "./components/ReturnBookCreate";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned"; //คืนหนังสืออออ
import PunchClockIcon from "@mui/icons-material/PunchClock"; //ยืมมหนังสือ
import DevicesOtherIcon from "@mui/icons-material/DevicesOther"; //ซื้ออุปกรณ์ฟ้า
import EquipmentPurchasing from "./components/EquipmentPurchasing";
import EquipmentPurchasingCreate from "./components/EquipmentPurchasingCreate";
import BorrowEquipment from "./components/BorrowEquipment";
import BorrowEquipmentCreate from "./components/BorrowEquipmentCreate";
import ReturnEquipment from "./components/ReturnEquipment";
import ReturnEquipmentCreate from "./components/ReturnEquipmentCreate";
import AddBoxIcon from "@mui/icons-material/AddBox"; ///add
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import Preorder from "./components/Preorder";
import PreorderCreate from "./components/PreorderCreate";
import Introduce from "./components/Introduce";
import IntroduceCreate from "./components/IntroduceCreate";
import Forfeit from "./components/Forfeit";
import ForfeitCreate from "./components/ForfeitCreate";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RecommendIcon from '@mui/icons-material/Recommend';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Confirmation from "./components/Confirmation";
import ConfirmationCreate from "./components/ConfirmationCreate";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BookRepair from "./components/BookRepair";
import BookRepairCreate from "./components/BookRepairCreate";
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import EquipmentRepair from "./components/EquipmentRepair";
import EquipmentRepairCreate from "./components/EquipmentRepairCreate";
import { UserInterface } from "./models/IUser";

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
  const [user, setUser] = useState<Partial<UserInterface>>({});
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
      name: "ระบบจัดซื้อหนังสือ",
      icon: <LibraryBooksIcon />,
      path: "/bookPurchasing",
    },
    {
      name: "ระบบจัดซื้ออุปกรณ์",
      icon: <DevicesOtherIcon />,
      path: "/equipmentPurchasing",
    },
    {
      name: "ระบบบันทึกการยืมหนังสือ",
      icon: <PunchClockIcon />,
      path: "/borrowbook",
    },
    {
      name: "ระบบบันทึกการคืนหนังสือ",
      icon: <AssignmentReturnedIcon />,
      path: "/returnbook",
    },
    {
      name: "ระบบบันทึกค่าปรับ",
      icon: <LocalAtmIcon />,
      path: "/forfeit/info",
    },
    {
      name: "ระบบเก็บข้อมูลการยืมอุปกรณ์",
      icon: <AddBoxIcon />,
      path: "/borrowEquipment",
    },
    {
      name: "ระบบเก็บข้อมูลการคืนอุปกรณ์",
      icon: <InstallDesktopIcon />,
      path: "/returnEquipment",
    },
    {
      name: "ระบบสั่งซื้อหนังสือ Pre-order",
      icon: <ShoppingCartIcon />,
      path: "/preorder",
    },
    {
      name: "ระบบยืนยันการรับหนังสือ",
      icon: <ShoppingCartCheckoutIcon />,
      path: "/confirmation",
    },
    {
      name: "ระบบการแจ้งซ่อมหนังสือ",
      icon: <MenuBookIcon />,
      path: "/bookrepair",
    },
    {
      name: "ระบบการแจ้งซ่อมอุปกรณ์",
      icon: <HomeRepairServiceIcon />,
      path: "/equipmentrepair",
    },
  ];
  const menuUser = [
    { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },

    {
      name: "ระบบแนะนำหนังสือเข้าห้องสมุด",
      icon: <RecommendIcon />,
      path: "/introduce/info",
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
    fetch(`${apiUrl}/librarian/${uid}`, requestOptions)
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
                    {user?.Email}
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
              <Route path="/bookPurchasing" element={<BookPurchasing />} />
              <Route
                path="/bookPurchasingCreate"
                element={<BookPurchasingCreate />}
              />
              <Route
                path="/equipmentPurchasing"
                element={<EquipmentPurchasing />}
              />
              <Route
                path="/equipmentPurchasingCreate"
                element={<EquipmentPurchasingCreate />}
              />
              <Route path="/borrowbook" element={<BorrowBook />} />
              <Route path="/borrowbook/create" element={<BorrowBookCreate />} />
              <Route path="/returnbook" element={<ReturnBook />} />
              <Route path="/returnbook/create" element={<ReturnBookCreate />} />
              <Route path="/borrowEquipment" element={<BorrowEquipment />} />
              <Route
                path="/borrowEquipment/create"
                element={<BorrowEquipmentCreate />}
              />
              <Route path="/returnEquipment" element={<ReturnEquipment />} />
              <Route
                path="/returnEquipment/create"
                element={<ReturnEquipmentCreate />}
              />

              <Route path="/introduce/info" element={<Introduce />} />
              <Route path="/introduce/create" element={<IntroduceCreate />} />
              <Route path="/forfeit/info" element={<Forfeit />} />
              <Route path="/forfeit/create" element={<ForfeitCreate />} />

               <Route path="/preorder" element={<Preorder />} />
               <Route path="/preorder/create" element={<PreorderCreate />} />
               <Route path="/confirmation" element={<Confirmation />} />
               <Route path="/confirmation/create" element={<ConfirmationCreate />} />

               <Route path="/bookrepair" element={<BookRepair />} />
               <Route path="/bookrepair/create" element={<BookRepairCreate />} />
               <Route path="/equipmentrepair" element={<EquipmentRepair />} />
               <Route path="/equipmentrepair/create" element={<EquipmentRepairCreate />} />
            </Routes>
          </div>
        </main>
      </Router>
    </div>
  );
}
