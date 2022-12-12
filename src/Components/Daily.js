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
import { app } from "../firebase";
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
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { useSelector } from "react-redux";
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
  const [addToPlanner, setAddToPlanner] = useState("");
  const [newText, setNewText] = useState("");
  const [category, setCategory] = useState("");
  const [addMenu, setAddMenu] = useState(false);
  const auth = getAuth();
  const database = getDatabase(app);
  const userRef = useSelector(function (state) {
    return state.user;
  });
  useEffect(
    function () {
      onValue(ref(database, `${userRef.id}/daily`), function (res) {
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
              key: item,
              parent: "priorities",
            });
          }
          for (let item in dataR) {
            newStateReminders.push({
              description: dataR[item].description,
              createdAt: dataR[item].createdAt,
              completed: dataR[item].completed,
              key: item,
              parent: "reminders",
            });
          }
          for (let item in dataT) {
            newStateToDo.push({
              description: dataT[item].description,
              createdAt: dataT[item].createdAt,
              completed: dataT[item].completed,
              key: item,
              parent: "toDo",
            });
          }
          for (let item in dataN) {
            newStateNotes.push({
              description: dataN[item].description,
              createdAt: dataN[item].createdAt,
              completed: dataN[item].completed,
              key: item,
              parent: "notes",
            });
          }
          newState.priorities = newStatePriorities;
          newState.reminders = newStateReminders;
          newState.toDo = newStateToDo;
          newState.notes = newStateNotes;
          setFirebaseData(newState);
        }
      });
    },
    [addToPlanner]
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
      push(ref(database, userRef.id + "/daily" + `/${category}`), {
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
    } else {
      console.log("not filled");
    }
  };
  const handleCancelText = function () {
    setNewText("");
    setCategory("");
    setAddMenu(false);
  };
  const handleEdit = function (e) {
    console.log(e.target);
  };
  const handleDelete = function (e) {
    Swal.fire({
      title: "Remove task from list?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "No, don't remove it",
    }).then((result) => {
      if (result.isConfirmed) {
        remove(
          ref(database, `${userRef.id}/daily/${e.target.value}/${e.target.id}`)
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
  return (
    <div className="dailyPlannerMain">
      <div className={`showAddMenu${addMenu}`}>
        <div onClick={(event) => event.stopPropagation()} className="addChore">
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
              <Button onClick={handleCancelText}>cancel</Button>
              <Button onClick={handleAddText}>add</Button>
            </div>
          </ThemeProvider>
        </div>
      </div>
      <nav className="wrapperSlim">
        <Link to={"/planner"}>
          <ThemeProvider theme={theme}>
            <Button>back</Button>
          </ThemeProvider>
        </Link>
        <ThemeProvider theme={theme}>
          <Button onClick={handleDatabaseAdd}>+</Button>
        </ThemeProvider>
        <h2>Daily Planner</h2>
        <p className="navDate">date: {dayjs().format("dddd/MM/YYYY")}</p>
      </nav>
      <div className="dailyContainer">
        <div className={`listContainers listContainerTopPriorities`}>
          <h3>top priorities</h3>
          <ul>
            {firebaseData.priorities?.map(function (item, index) {
              return (
                <li key={item.id} id={item.key}>
                  <p>{item.description}</p>
                  <div className="options">
                    <IconButton
                      value={item.parent}
                      onClick={handleEdit}
                      aria-label="edit"
                      size="small"
                      id={`${item.key}`}
                    >
                      <EditIcon
                        style={{ pointerEvents: "none" }}
                        fontSize="inherit"
                      />
                    </IconButton>
                    <IconButton
                      value={item.parent}
                      id={`${item.key}`}
                      onClick={handleDelete}
                      aria-label="delete"
                      size="small"
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
                <li key={item.id} id={item.key}>
                  <p>{item.description}</p>
                  <div className="options">
                    <IconButton
                      value={item.parent}
                      id={`${item.key}`}
                      onClick={handleEdit}
                      aria-label="edit"
                      size="small"
                    >
                      <EditIcon
                        style={{ pointerEvents: "none" }}
                        fontSize="inherit"
                      />
                    </IconButton>
                    <IconButton
                      value={item.parent}
                      id={`${item.key}`}
                      onClick={handleDelete}
                      aria-label="delete"
                      size="small"
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
                <li key={item.id} id={item.key}>
                  <p>{item.description}</p>
                  <div className="options">
                    <IconButton
                      value={item.parent}
                      id={`${item.key}`}
                      onClick={handleEdit}
                      aria-label="edit"
                      size="small"
                    >
                      <EditIcon
                        style={{ pointerEvents: "none" }}
                        fontSize="inherit"
                      />
                    </IconButton>
                    <IconButton
                      value={item.parent}
                      id={`${item.key}`}
                      onClick={handleDelete}
                      aria-label="delete"
                      size="small"
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
                <li key={item.id} id={item.key}>
                  <p>{item.description}</p>
                  <div className="options">
                    <IconButton
                      value={item.parent}
                      id={`${item.key}`}
                      onClick={handleEdit}
                      aria-label="edit"
                      size="small"
                    >
                      <EditIcon
                        style={{ pointerEvents: "none" }}
                        fontSize="inherit"
                      />
                    </IconButton>
                    <IconButton
                      value={item.parent}
                      id={`${item.key}`}
                      onClick={handleDelete}
                      aria-label="delete"
                      size="small"
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
};

export default Daily;
