import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import { v4 as uuid } from "uuid";
import TextField from "@mui/material/TextField";
import * as dayjs from "dayjs";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
  const [addToPlanner, setAddToPlanner] = useState("");
  const [newText, setNewText] = useState("");
  const [category, setCategory] = useState("");
  const [addMenu, setAddMenu] = useState(false);
  const [render, setRender] = useState(false);
  const database = getDatabase(app);
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
    if (newText !== "" && category !== "") {
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
      input: "text",
      inputValue: e.target.parentElement.parentElement.textContent,
      // inputPlaceholder: e.target.parentElement.parentElement.textContent,
      background: "#B38FFB",
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
            <h2>select category</h2>
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
            <Link to={"/planner"}>
              <ThemeProvider theme={theme}>
                <Button>back</Button>
              </ThemeProvider>
            </Link>
            <ThemeProvider theme={theme}>
              <Button onClick={handleDatabaseAdd}>ADD TASK</Button>
            </ThemeProvider>
          </div>
          <h2>Daily Planner</h2>
          <p className="navDate">date: {dayjs().format("dddd/MM/YYYY")}</p>
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
                        sx={{ color: "#6F204D" }}
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
                        sx={{ color: "#6F204D" }}
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
                        sx={{ color: "#6F204D" }}
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
                        sx={{ color: "#6F204D" }}
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
                        sx={{ color: "#6F204D" }}
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
                        sx={{ color: "#6F204D" }}
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
                        sx={{ color: "#6F204D" }}
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
                        sx={{ color: "#6F204D" }}
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
