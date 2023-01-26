import Button from "@mui/material/Button";
import React from "react";
import SignInLibrarian from "./SignInLibrarian";
import SignInUser from "./SignInUser";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";

export default function Loging() {
  const [Librarian, setLibrarian] = React.useState(false);
  const [User, setUser] = React.useState(true);

  const handleChangeLibrarian = () => {
    setLibrarian(true);
    setUser(false);
  };
  const handleChangeUser = () => {
    setLibrarian(false);
    setUser(true);
  };
  return (
    <div className="Login">
      <nav>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={handleChangeUser}>
            User
          </Button>
          <Button variant="contained" onClick={handleChangeLibrarian}>
          Librarian
          </Button>
        </Stack>
      </nav>
      {Librarian && <SignInLibrarian />}
      {User && <SignInUser />}
    </div>
  );
}
