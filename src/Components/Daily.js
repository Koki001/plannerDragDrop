import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import { v4 as uuid } from "uuid";
import TextField from "@mui/material/TextField";
import * as dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app, auth } from "../firebase";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getDatabase,
  onValue,
  ref,
  set,
  update,
  get,
  child,
  push,
  remove,
} from "firebase/database";
import {
  USER_ID,
  USER_LOGGED_IN,
  USER_NAME,
  USER_EMAIL,
  USER_SIGN_OUT,
} from "../slices/userSlice";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { current } from "@reduxjs/toolkit";
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
          padding: "0",
          color: "#6F204D",
          border: "2px solid #6F204D",
          fontSize: "0.9rem",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            transform: "scale(1.2)",
            borderRadius: "4px",
            backgroundColor: "transparent",
            color: "#B38FFB",
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: "#B38FFB",
          color: "#6F204D",
          border: "2px solid #6F204D",
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
const Daily = function () {
  const [firebaseData, setFirebaseData] = useState([]);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);
  const [categoryMax, setCategoryMax] = useState({
    priorities: 8,
    reminders: 8,
    toDo: 18,
    notes: 8,
  });
  const [addToPlanner, setAddToPlanner] = useState("");
  const [newText, setNewText] = useState("");
  const [category, setCategory] = useState("");
  const [addMenu, setAddMenu] = useState(false);
  const [render, setRender] = useState(false);
  const database = getDatabase(app);
  const navigate = useNavigate();
  const userRef = useSelector(function (state) {
    return state.user;
  });
  useEffect(
    function () {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          onValue(ref(database, `${user.uid}/daily`), function (res) {
            if (res.exists && res.val() !== null) {
              const newState = {
                priorities: [],
                reminders: [],
                toDo: [],
                notes: [],
              };
              const newStatePriorities = [];
              const newStateReminders = [];
              const newStateToDo = [];
              const newStateNotes = [];
              const dataP = res.val().priorities;
              const dataR = res.val().reminders;
              const dataT = res.val().toDo;
              const dataN = res.val().notes;
              for (let item in dataP) {
                newStatePriorities.push({
                  description: dataP[item].description,
                  createdAt: dataP[item].createdAt,
                  completed: dataP[item].completed,
                  id: item,
                  parent: "priorities",
                });
              }
              for (let item in dataR) {
                newStateReminders.push({
                  description: dataR[item].description,
                  createdAt: dataR[item].createdAt,
                  completed: dataR[item].completed,
                  id: item,
                  parent: "reminders",
                });
              }
              for (let item in dataT) {
                newStateToDo.push({
                  description: dataT[item].description,
                  createdAt: dataT[item].createdAt,
                  completed: dataT[item].completed,
                  id: item,
                  parent: "toDo",
                });
              }
              for (let item in dataN) {
                newStateNotes.push({
                  description: dataN[item].description,
                  createdAt: dataN[item].createdAt,
                  completed: dataN[item].completed,
                  id: item,
                  parent: "notes",
                });
              }
              newState.priorities = newStatePriorities;
              newState.reminders = newStateReminders;
              newState.toDo = newStateToDo;
              newState.notes = newStateNotes;
              setFirebaseData(newState);
              setFirebaseLoaded(true);
            } else {
              setFirebaseData([]);
              setFirebaseLoaded(true);
            }
          });
        }
      });
    },
    [addToPlanner, auth]
  );

  useEffect(
    function () {
      setRender(!render);
      // console.log(firebaseData);
    },
    [firebaseData]
  );

  const handleDatabaseAdd = function () {
    setAddMenu(true);
    setAddToPlanner(!addToPlanner);
  };
  const handleTextChange = function (e) {
    setNewText(e.target.value);
  };
  const handleAddText = function () {
    console.log(category);
    if (newText !== "" && category !== "") {
      if (firebaseData[category]) {
        if (firebaseData[category].length < categoryMax[category]) {
          push(
            ref(database, auth.currentUser.uid + "/daily" + `/${category}`),
            {
              description: newText,
              created: dayjs().format("dddd/MM/YYYY"),
              completed: false,
              id: uuid(),
              parent: category,
            }
          ).then(function () {
            setNewText("");
            setCategory("");
            setAddMenu(false);
            setAddToPlanner(!addToPlanner);
          });
        } else if (firebaseData[category].length >= categoryMax[category]) {
          Swal.fire({
            reverseButtons: true,
            background: "#B38FFB",
            confirmButtonColor: "#6F204D",
            color: "#6F204D",
            text: "Maximum number of tasks reached. Please remove some items before adding new ones.",
            showCancelButton: false,
            confirmButtonText: "Ok",
          }).then(function (res) {
            if (res.isConfirmed) {
              setNewText("");
              setCategory("");
              setAddMenu(false);
              setAddToPlanner(!addToPlanner);
            }
          });
        }
      } else {
        push(ref(database, auth.currentUser.uid + "/daily" + `/${category}`), {
          description: newText,
          created: dayjs().format("dddd/MM/YYYY"),
          completed: false,
          id: uuid(),
          parent: category,
        }).then(function () {
          setNewText("");
          setCategory("");
          setAddMenu(false);
          setAddToPlanner(!addToPlanner);
        });
      }
    } else if (category === "") {
      Swal.fire({
        background: "#B38FFB",
        confirmButtonColor: "#6F204D",
        color: "#6F204D",
        text: "Please select a category for your task",
        showCancelButton: false,
        confirmButtonText: "Ok",
      });
    } else if (newText === "") {
      Swal.fire({
        background: "#B38FFB",
        confirmButtonColor: "#6F204D",
        color: "#6F204D",
        text: "Please add a description",
        showCancelButton: false,
        confirmButtonText: "Ok",
      });
    }
  };
  const handleCancelText = function () {
    setNewText("");
    setCategory("");
    setAddMenu(false);
  };
  const handleEdit = function (e) {
    // console.log(e.target);
    Swal.fire({
      reverseButtons: true,
      input: "text",
      inputValue: e.target.parentElement.parentElement.textContent,
      // inputPlaceholder: e.target.parentElement.parentElement.textContent,
      background: "#FFF8EE",
      confirmButtonColor: "#6F204D",
      color: "#6F204D",
      title: "Task Editor",
      text: `Edit selected task in ${
        e.target.value === "priorities"
          ? "Top Priorities"
          : e.target.value === "toDo"
          ? "To Do"
          : e.target.value
      }`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then(function (res) {
      if (res.isConfirmed) {
        update(
          ref(
            database,
            `${auth.currentUser.uid}/daily/${e.target.value}/${e.target.id}`
          ),
          {
            description: res.value,
          }
        );
      }
    });
  };
  const handleDelete = function (e) {
    // console.log(e.target.id);
    Swal.fire({
      reverseButtons: true,
      background: "#B38FFB",
      confirmButtonColor: "#6F204D",
      color: "#6F204D",
      title: "Remove task from list?",
      icon: "warning",
      iconColor: "#FFB84C",
      showCancelButton: true,
      cancelButtonColor: "#6F204D",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "No, don't remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        remove(
          ref(
            database,
            `${auth.currentUser.uid}/daily/${e.target.value}/${e.target.id}`
          )
        );
        setAddToPlanner(!addToPlanner);
      } else {
        return;
      }
    });
  };

  const handleFormChange = function (e) {
    setCategory(e.target.value);
    console.log(e.target.value);
  };
  const handleEnterKeyPress = function (e) {
    if (e.code === "Enter") {
      // console.log("ENTER")
      handleAddText();
    }
  };
  const onDrag = function (e, index) {
    // console.log("start", e.target, index);
  };
  const onDragEnter = function (e, index) {
    // console.log("drag enter", e.target, index);
  };
  const handleSort = function () {};
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = function () {
    setAnchorEl(null);
  };
  const handleGoBack = () => {
    setAnchorEl(null);
    navigate("/planner");
  };
  const handleLogout = function () {
    setAnchorEl(null);
    Swal.fire({
      reverseButtons: true,
      background: "#B38FFB",
      confirmButtonColor: "#6F204D",
      color: "#6F204D",
      title: "Are you sure you want to log out?",
      icon: "warning",
      iconColor: "#FFB84C",
      showCancelButton: true,
      cancelButtonColor: "#6F204D",
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
    }).then(function (result) {
      if (result.isConfirmed) {
        signOut(auth);
      } else {
        setAnchorEl(null);
      }
    });
  };
  if (firebaseLoaded === true) {
    return (
      <div className="dailyPlannerMain">
        <div
          onClick={() => setAddMenu(false)}
          className={`showAddMenu${addMenu}`}
        >
          <div
            onKeyUp={handleEnterKeyPress}
            onClick={(event) => event.stopPropagation()}
            className="addChore"
          >
            <h2>add to daily planner</h2>
            <form className="radioCategories" onChange={handleFormChange}>
              <div>
                <input
                  className="sr-only"
                  type="radio"
                  id="priorities"
                  name="categories"
                  value="priorities"
                  checked={category === "priorities"}
                  readOnly
                />
                <label htmlFor="priorities">top priorities</label>
              </div>
              <div>
                <input
                  className="sr-only"
                  type="radio"
                  id="reminders"
                  name="categories"
                  value="reminders"
                  checked={category === "reminders"}
                  readOnly
                />
                <label htmlFor="reminders">reminders</label>
              </div>
              <div>
                <input
                  className="sr-only"
                  type="radio"
                  id="toDo"
                  name="categories"
                  value="toDo"
                  checked={category === "toDo"}
                  readOnly
                />
                <label htmlFor="toDo">to do</label>
              </div>

              <div>
                <input
                  className="sr-only"
                  type="radio"
                  id="notes"
                  name="categories"
                  value="notes"
                  checked={category === "notes"}
                  readOnly
                />
                <label htmlFor="notes">notes</label>
              </div>
            </form>
            <ThemeProvider theme={theme}>
              <TextField
                style={{ width: "100%" }}
                onChange={handleTextChange}
                id="text-input"
                label="description"
                variant="standard"
                value={newText}
              />
              <div className="choreButtons">
                <Button
                  style={{ color: "white" }}
                  variant="contained"
                  onClick={handleCancelText}
                >
                  cancel
                </Button>
                <Button
                  style={{ color: "white" }}
                  variant="contained"
                  onClick={handleAddText}
                >
                  add
                </Button>
              </div>
            </ThemeProvider>
          </div>
        </div>
        <nav className="wrapperSlim">
          <div className="navMenuContainer">
            <ThemeProvider theme={theme}>
              <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClickMenu}
                sx={{
                  borderRadius: "20px",
                  padding: "0",
                }}
              >
                <MenuIcon
                  sx={{
                    color: "#6F204D",
                    fontSize: "50px",
                  }}
                />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {/* <Link to={"/planner"}> */}
                <MenuItem id={"back"} onClick={handleGoBack}>
                  Go Back
                </MenuItem>
                {/* </Link> */}
                <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </ThemeProvider>
            <ThemeProvider theme={theme}>
              <IconButton
                sx={{
                  borderRadius: "20px",
                  padding: "0",
                }}
                onClick={handleDatabaseAdd}
              >
                <AddIcon
                  sx={{
                    color: "#6F204D",
                    fontSize: "50px",
                  }}
                />
              </IconButton>
            </ThemeProvider>
          </div>
          <h2>Daily Planner</h2>
          <p className="navDate">{dayjs().format("dddd/MM/YYYY")}</p>
        </nav>
        <div className="dailyContainer">
          <div className={`listContainers listContainerTopPriorities`}>
            <h3>top priorities</h3>
            <ul>
              {firebaseData.priorities?.map(function (item, index) {
                return (
                  <li
                    draggable
                    onDrag={onDrag}
                    onDragEnter={onDragEnter}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                    key={uuid()}
                    id={item.id}
                  >
                    <p>{item.description}</p>
                    <div className="options">
                      <IconButton
                        value={item.parent}
                        onClick={handleEdit}
                        aria-label="edit"
                        size="small"
                        id={`${item.id}`}
                        sx={{ color: "#6F204D", padding: "0" }}
                      >
                        <EditIcon
                          style={{ pointerEvents: "none" }}
                          fontSize="inherit"
                        />
                      </IconButton>
                      <IconButton
                        value={item.parent}
                        id={`${item.id}`}
                        onClick={handleDelete}
                        aria-label="delete"
                        size="small"
                        sx={{ color: "#6F204D", padding: "0" }}
                      >
                        <DeleteIcon
                          style={{ pointerEvents: "none" }}
                          fontSize="inherit"
                        />
                      </IconButton>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={`listContainers listContainerReminders`}>
            <h3>reminders</h3>
            <ul>
              {firebaseData.reminders?.map(function (item, index) {
                return (
                  <li
                    draggable
                    onDrag={onDrag}
                    onDragEnter={onDragEnter}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                    key={uuid()}
                    id={item.id}
                  >
                    <p>{item.description}</p>
                    <div className="options">
                      <IconButton
                        value={item.parent}
                        id={`${item.id}`}
                        onClick={handleEdit}
                        aria-label="edit"
                        size="small"
                        sx={{ color: "#6F204D", padding: "0" }}
                      >
                        <EditIcon
                          style={{ pointerEvents: "none" }}
                          fontSize="inherit"
                        />
                      </IconButton>
                      <IconButton
                        value={item.parent}
                        id={`${item.id}`}
                        onClick={handleDelete}
                        aria-label="delete"
                        size="small"
                        sx={{ color: "#6F204D", padding: "0" }}
                      >
                        <DeleteIcon
                          style={{ pointerEvents: "none" }}
                          fontSize="inherit"
                        />
                      </IconButton>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={`listContainers listContainerToDo`}>
            <h3>to do</h3>
            <ul>
              {firebaseData.toDo?.map(function (item, index) {
                return (
                  <li
                    draggable
                    onDrag={onDrag}
                    onDragEnter={onDragEnter}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                    key={uuid()}
                    id={item.id}
                  >
                    <p>{item.description}</p>
                    <div className="options">
                      <IconButton
                        value={item.parent}
                        id={`${item.id}`}
                        onClick={handleEdit}
                        aria-label="edit"
                        size="small"
                        sx={{ color: "#6F204D", padding: "0" }}
                      >
                        <EditIcon
                          style={{ pointerEvents: "none" }}
                          fontSize="inherit"
                        />
                      </IconButton>
                      <IconButton
                        value={item.parent}
                        id={`${item.id}`}
                        onClick={handleDelete}
                        aria-label="delete"
                        size="small"
                        sx={{ color: "#6F204D", padding: "0" }}
                      >
                        <DeleteIcon
                          style={{ pointerEvents: "none" }}
                          fontSize="inherit"
                        />
                      </IconButton>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={`listContainers listContainerNotes`}>
            <h3>notes</h3>
            <ul>
              {firebaseData.notes?.map(function (item, index) {
                return (
                  <li
                    draggable
                    onDrag={onDrag}
                    onDragEnter={onDragEnter}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                    key={uuid()}
                    id={item.id}
                  >
                    <p>{item.description}</p>
                    <div className="options">
                      <IconButton
                        value={item.parent}
                        id={`${item.id}`}
                        onClick={handleEdit}
                        aria-label="edit"
                        size="small"
                        sx={{ color: "#6F204D", padding: "0" }}
                      >
                        <EditIcon
                          style={{ pointerEvents: "none" }}
                          fontSize="inherit"
                        />
                      </IconButton>
                      <IconButton
                        value={item.parent}
                        id={`${item.id}`}
                        onClick={handleDelete}
                        aria-label="delete"
                        size="small"
                        sx={{ color: "#6F204D", padding: "0" }}
                      >
                        <DeleteIcon
                          style={{ pointerEvents: "none" }}
                          fontSize="inherit"
                        />
                      </IconButton>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  } else if (firebaseLoaded === false) {
    return (
      <div id="loadingDiv">
        <CircularProgress
          color="secondary"
          style={{ width: "100px", height: "100px" }}
        />
      </div>
    );
  }
};

export default Daily;
