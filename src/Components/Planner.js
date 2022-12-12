import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";

const Planner = function () {
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
            border: "2px solid transparent",
            "&:hover": {
              backgroundColor: "transparent",
              border: "2px solid #6F204D",
            },
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
    const userInfo = useSelector(function (state) {
      return state;
    });
    console.log(userInfo)
  return (
    <div className="plannerCategories">
      <ul>
        <li>
          {" "}
          <Link to={"/daily"}>
            <ThemeProvider theme={theme}>
              <Button style={{ width: "100%" }} variant="filled">
                daily
              </Button>
            </ThemeProvider>
          </Link>
        </li>
        <li>
          {" "}
          <Link to={"/weekly"}>
          <ThemeProvider theme={theme}>
            <Button style={{ width: "100%" }} variant="filled">
              weekly
            </Button>
          </ThemeProvider>
          </Link>
        </li>
        <li>
          {" "}
          {/* <Link to={"/monthly"}> */}
          <ThemeProvider theme={theme}>
            <Button disabled style={{ width: "100%" }} variant="filled">
              monthly
            </Button>
          </ThemeProvider>
          {/* </Link> */}
        </li>
        <li>
          {" "}
          {/* <Link to={"/yearly"}> */}
          <ThemeProvider theme={theme}>
            <Button disabled style={{ width: "100%" }} variant="filled">
              yearly
            </Button>
          </ThemeProvider>
          {/* </Link> */}
        </li>
        <li>
          {" "}
          {/* <Link to={"/celendar"}> */}
          <ThemeProvider theme={theme}>
            <Button disabled style={{ width: "100%" }} variant="filled">
              calendar
            </Button>
          </ThemeProvider>
          {/* </Link> */}
        </li>
        <li>
          {" "}
          {/* <Link to={"/blank-notes"}> */}
          <ThemeProvider theme={theme}>
            <Button disabled style={{ width: "100%" }} variant="filled">
              blank notes
            </Button>
          </ThemeProvider>
          {/* </Link> */}
        </li>
      </ul>
    </div>
  );
};

export default Planner;
