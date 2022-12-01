import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const WelcomePage = function () {
  // Material UI Theme
  const theme = createTheme({
    palette: {
      primary: {
        main: "#6F204D",
      },
    },
    typography: {
      fontFamily: "Righteous",
    },
  });
  return (
    <main className="welcomeMain">
      <h1>Retro Life Planner</h1>
      <div className="loginMain">
        <div className="loginContainer">
          {/* LOGIN INPUT / BUTTON */}
          <h2>Already have an account ?</h2>
          <ThemeProvider theme={theme}>
            <TextField
              style={{ width: "100%" }}
              id="email-input"
              label="Email"
              type="email"
              variant="filled"
            />
            <TextField
              style={{ width: "100%" }}
              id="password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="filled"
            />
            <Link to={"planner"}>
              <Button variant="contained">Log In</Button>
            </Link>
          </ThemeProvider>
        </div>
        <div className="signUpContainer">
          {/* SIGN UP */}
          <h2>Create an account?</h2>
          <Link to={"/signup"}>
            <ThemeProvider theme={theme}>
              <Button variant="contained">Sign Up</Button>
            </ThemeProvider>
          </Link>
        </div>
      </div>
    </main>
  );
};
export default WelcomePage;
