import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { InputAdornment } from "@mui/material";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";
import { auth } from "../firebase";
import { useState } from "react";

const SignUp = function () {
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
  const navigate = useNavigate();
  // const authenticate = getAuth();
  const [newUser, setNewUser] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [fillField, setFillField] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [passMatchVisible, setPassMatchVisible] = useState(false);

  const createAccount = async function () {
    if (newPass === confirmPass) {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          newEmail,
          newPass
        );
        updateProfile(auth.currentUser, {
          displayName: newUser,
        }).then(function () {
          const db = getDatabase();
          set(ref(db, user.user.uid + "/user"), {
            name: user.user.displayName,
            email: user.user.email,
          }).then(function () {
            Swal.fire({
              background: "#B38FFB",
              confirmButtonColor: "#6F204D",
              color: "#6F204D",
              icon: "success",
              iconColor: "#6F204D",
              title: "Account Created",
              text: `Welcome, ${user.user.displayName}`,
            }).then(function (res) {
              if (res.isConfirmed) {
                navigate("/planner");
              }
            });
          });
        });
      } catch (error) {
        if (newUser === "" || newEmail === "" || newPass === "") {
          Swal.fire({
            icon: "warning",
            iconColor: "#FFB84C",
            text: "Please fill out all of the fields",
            background: "#B38FFB",
            confirmButtonColor: "#6F204D",
            color: "#6F204D",
          }).then(function (res) {
            if (res.isConfirmed) {
              setFillField(true);
            }
          });
        } else if (error.code === "auth/email-already-in-use") {
          Swal.fire({
            icon: "warning",
            iconColor: "#FFB84C",
            text: "The e-mail is already in use",
            background: "#B38FFB",
            confirmButtonColor: "#6F204D",
            color: "#6F204D",
          });
        } else if (error.code === "auth/weak-password"){
          Swal.fire({
            icon: "warning",
            iconColor: "#FFB84C",
            text: "Password must have a minimum of 6 characters",
            background: "#B38FFB",
            confirmButtonColor: "#6F204D",
            color: "#6F204D",
          });
        } else if (error.code === "auth/invalid-email"){
          Swal.fire({
            icon: "warning",
            iconColor: "#FFB84C",
            text: "Please enter a valid e-mail",
            background: "#B38FFB",
            confirmButtonColor: "#6F204D",
            color: "#6F204D",
          });
        } console.log(error.code);
      }
    } else {
      Swal.fire({
        icon: "warning",
        iconColor: "#FFB84C",
        text: "Passwords do not match",
        background: "#B38FFB",
        confirmButtonColor: "#6F204D",
        color: "#6F204D",
      });
    }
  };
  const handleNewUsername = function (e) {
    setNewUser(e.target.value);
  };
  const handleNewEmail = function (e) {
    setNewEmail(e.target.value);
  };
  const handleNewPass = function (e) {
    setNewPass(e.target.value);
  };
  const handleConfirmPass = function (e) {
    setConfirmPass(e.target.value);
  };
  const handlePassVisibility = function () {
    setPassVisible(!passVisible);
  };
  const handlePassMatchVisibility = function () {
    setPassMatchVisible(!passMatchVisible);
  };
  return (
    <div className="signUpMain">
      <h2>Create new account</h2>
      <ThemeProvider theme={theme}>
        <TextField
          onChange={handleNewUsername}
          style={{ width: "100%", border: "2px solid #6F204D" }}
          id="username-input"
          label="Username / Display name"
          type="text"
          variant="filled"
        />
        <TextField
          onChange={handleNewEmail}
          style={{ width: "100%", border: "2px solid #6F204D" }}
          id="email-input"
          label="E-mail"
          type="email"
          variant="filled"
        />
        <TextField
          onChange={handleNewPass}
          style={{ width: "100%", border: "2px solid #6F204D" }}
          id="password-input"
          label="Password"
          type={passVisible ? "text" : "password"}
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
        <TextField
          onChange={handleConfirmPass}
          style={{ width: "100%", border: "2px solid #6F204D" }}
          id="password-input"
          label="Confirm Password"
          type={passMatchVisible ? "text" : "password"}
          variant="filled"
          InputProps={{
            endAdornment: (
              <InputAdornment style={{ cursor: "pointer" }} position="end">
                {passMatchVisible ? (
                  <VisibilityIcon onClick={handlePassMatchVisibility} />
                ) : (
                  <VisibilityOffIcon onClick={handlePassMatchVisibility} />
                )}
              </InputAdornment>
            ),
          }}
        />

        <Button onClick={createAccount} variant="contained">
          Create Account
        </Button>

        <Link to={"/"}>
          <Button variant="contained">Back</Button>
        </Link>
      </ThemeProvider>
    </div>
  );
};
export default SignUp;
