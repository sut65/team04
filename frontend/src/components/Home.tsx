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
        <h1 style={{ textAlign: "center" }}>ระบบโภชนาการ</h1>
        <img
          src="https://static01.nyt.com/images/2019/02/28/opinion/28yun/28yun-superJumbo.jpg?quality=75&auto=webp"
          alt=""
          width="100%"
          height="100%"
        />
      </Container>
    </div>
  );
}
export default Home;
