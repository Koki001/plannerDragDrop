import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import { useState } from "react";
import ConstructionIcon from "@mui/icons-material/Construction";
const Planner = function () {
  const [headings, setHeadings] = useState([
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "calendar",
    "blank notes",
  ]);
  const [headingCS, setHeadingCS] = useState("");
  // Material UI Theme
  const theme = createTheme({
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#6F204D",
            border: "transparent",
            "&:hover": {
              backgroundColor: "#6F204D",
              color: "#B38FFB",
              border: "transparent",
              borderRadius: "0",
            },
            padding: "0",
            fontSize: "1.5rem",
          },
        },
      },
    },

    palette: {
      primary: {
        main: "#6F204D",
        contrastText: "#ff0000",
      },
    },
    typography: {
      fontFamily: "Righteous",
    },
  });
  const navigate = useNavigate();
  const userInfo = useSelector(function (state) {
    return state;
  });
  const handleSignOut = function () {
    Swal.fire({
      reverseButtons: true,
      background: "#B38FFB",
      confirmButtonColor: "#6F204D",
      color: "#6F204D",
      title: "Are you sure you want to sign out?",
      icon: "warning",
      iconColor: "#FFB84C",
      showCancelButton: true,
      cancelButtonColor: "#6F204D",
      confirmButtonText: "Sign Out",
      cancelButtonText: "Cancel",
    }).then(function (result) {
      if (result.isConfirmed) {
        signOut(auth);
      }
    });
  };
  const handleHover = function (e) {
    setHeadingCS("coming soon");
    e.target.firstElementChild.innerText = "COMING SOON";
    e.target.style.backgroundColor = "#ffb74c50";
  };
  const handleExitHover = function (e) {
    e.target.firstElementChild.innerText = headings[e.target.value];
    console.log(e.target);
    e.target.style.backgroundColor = "transparent";
  };
  return (
    <div className="plannerCategories">
      <ul>
        <li value={0}>
          {" "}
          <Link to={"/daily"}>
            <ThemeProvider theme={theme}>
              <Button style={{ width: "100%" }} variant="filled">
                daily
              </Button>
            </ThemeProvider>
          </Link>
        </li>
        <li value={1} onMouseOver={handleHover} onMouseLeave={handleExitHover}>
          {" "}
          {/* <Link to={"/weekly"}> */}
          <ThemeProvider theme={theme}>
            <Button disabled style={{ width: "100%" }} variant="filled">
              weekly
            </Button>
          </ThemeProvider>
          {/* </Link> */}
        </li>
        <li value={2} onMouseOver={handleHover} onMouseLeave={handleExitHover}>
          {" "}
          {/* <Link to={"/monthly"}> */}
          <ThemeProvider theme={theme}>
            <Button disabled style={{ width: "100%" }} variant="filled">
              monthly
            </Button>
          </ThemeProvider>
          {/* </Link> */}
        </li>
        <li value={3} onMouseOver={handleHover} onMouseLeave={handleExitHover}>
          {" "}
          {/* <Link to={"/yearly"}> */}
          <ThemeProvider theme={theme}>
            <Button disabled style={{ width: "100%" }} variant="filled">
              yearly
            </Button>
          </ThemeProvider>
          {/* </Link> */}
        </li>
        <li value={4} onMouseOver={handleHover} onMouseLeave={handleExitHover}>
          {" "}
          {/* <Link to={"/calendar"}> */}
          <ThemeProvider theme={theme}>
            <Button disabled style={{ width: "100%" }} variant="filled">
              calendar
            </Button>
          </ThemeProvider>
          {/* </Link> */}
        </li>
        <li value={5} onMouseOver={handleHover} onMouseLeave={handleExitHover}>
          {" "}
          {/* <Link to={"/blank-notes"}> */}
          <ThemeProvider theme={theme}>
            <Button disabled style={{ width: "100%" }} variant="filled">
              blank notes
            </Button>
          </ThemeProvider>
          {/* </Link> */}
        </li>
        <li className="signOutButton">
          {" "}
          {/* <Link to={"/blank-notes"}> */}
          <ThemeProvider theme={theme}>
            <Button
              onClick={handleSignOut}
              style={{ width: "100%" }}
              variant="outlined"
            >
              Sign Out
            </Button>
          </ThemeProvider>
          {/* </Link> */}
        </li>
      </ul>
    </div>
  );
};

export default Planner;
