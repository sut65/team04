import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
    },

    table: {
      minWidth: 650,
    },
    tableSpace: {
      marginTop: 20,
    },
  })
);
function Home() {
  const classes = useStyles();

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <h1 style={{ textAlign: "center" }}>ระบบห้องสมุด</h1>
        <img
          src="https://edu.suth.go.th/wp-content/uploads/2021/12/DSCF9682-1160x773.jpg"
          alt=""
          width="100%"
          height="100%"
        />
      </Container>
    </div>
  );
}
export default Home;
