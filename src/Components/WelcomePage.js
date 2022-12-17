import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { InputAdornment } from "@mui/material";
import {
  USER_LOGGED_IN,
  USER_NAME,
  USER_ID,
  USER_EMAIL,
  USER_SIGN_OUT,
} from "../slices/userSlice";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import Swal from "sweetalert2";
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
  const [logInEmail, setLogInEmail] = useState("");
  const [logInPassword, setLogInPassword] = useState("");
  const [passVisible, setPassVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const auth = getAuth();
  const location = useLocation();

  useEffect(function () {
    if (location.pathname === "/" || location.pathname === "/signup") {
      signOut(auth);
    }
  }, []);
  const login = async function () {
    try {
      await signInWithEmailAndPassword(
        auth,
        logInEmail,
        logInPassword
      ).then(function (userCredential) {
        // console.log(userCredential);
        // dispatch(USER_LOGGED_IN(true))
        // dispatch(USER_ID(userCredential.user.uid))
        // dispatch(USER_NAME(userCredential.user.displayName))
        // dispatch(USER_EMAIL(userCredential.user.email))
        Swal.fire({
          timer: 1500,
          background: "#B38FFB",
          showConfirmButton: false,
          color: "#6F204D",
          icon: "success",
          iconColor: "#6F204D",
          title: `Welcome back, ${auth.currentUser.displayName}`,
        }).then(function (res) {
          if (res.dismiss === Swal.DismissReason.timer) {
            navigate("/planner");
          }
        });
        // navigate("/planner");
      });
    } catch (error) {
      if (logInEmail === "" || logInPassword === "") {
        Swal.fire({
          background: "#B38FFB",
          confirmButtonColor: "#6F204D",
          color: "#6F204D",
          icon: "warning",
          iconColor: "#FFB84C",
          confirmButtonText: "Ok",
          text: "Please fill out your e-mail and password",
        });
      } else if (error.message === "Firebase: Error (auth/user-not-found).") {
        Swal.fire({
          background: "#B38FFB",
          confirmButtonColor: "#6F204D",
          color: "#6F204D",
          icon: "warning",
          iconColor: "#FFB84C",
          confirmButtonText: "Ok",
          text: "The password and e-mail do not match",
        });
      } else if (error.message === "Firebase: Error (auth/wrong-password).") {
        Swal.fire({
          background: "#B38FFB",
          confirmButtonColor: "#6F204D",
          color: "#6F204D",
          icon: "warning",
          iconColor: "#FFB84C",
          confirmButtonText: "Ok",
          text: "Wrong password",
        });
      } else if (error.message === "Firebase: Error (auth/invalid-email).") {
        Swal.fire({
          background: "#B38FFB",
          confirmButtonColor: "#6F204D",
          color: "#6F204D",
          icon: "warning",
          iconColor: "#FFB84C",
          confirmButtonText: "Ok",
          text: "The e-mail entered is invalid",
        });
      }
    }
  };
  const handleLogin = function (e) {
    login();
  };
  const handleEmailChange = function (e) {
    setLogInEmail(e.target.value);
  };
  const handlePasswordChange = function (e) {
    setLogInPassword(e.target.value);
  };
  const handlePassVisibility = function () {
    setPassVisible(!passVisible);
  };
  return (
    <main className="welcomeMain">
      <h1>Retro Life Planner</h1>
      <div className="loginMain">
        <div className="loginContainer">
          {/* LOGIN INPUT / BUTTON */}
          <h2>Already have an account ?</h2>
          <ThemeProvider theme={theme}>
            <TextField
              style={{ width: "100%", border: "2px solid #6F204D" }}
              onChange={handleEmailChange}
              id="email-input"
              label="Email"
              type="email"
              variant="filled"
            />
            <TextField
              style={{ width: "100%", border: "2px solid #6F204D" }}
              onChange={handlePasswordChange}
              id="password-input"
              label="Password"
              type={passVisible ? "text" : "password"}
              autoComplete="current-password"
              variant="filled"
              InputProps={{
                endAdornment: (
                  <InputAdornment style={{ cursor: "pointer" }} position="end">
                    {passVisible ? (
                      <VisibilityIcon onClick={handlePassVisibility} />
                    ) : (
                      <VisibilityOffIcon onClick={handlePassVisibility} />
                    )}
                  </InputAdornment>
                ),
              }}
            />

            <Button style={{width: "100%", marginTop: "10px"}} onClick={handleLogin} variant="contained">
              Log In
            </Button>
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
