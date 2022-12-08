import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import * as dayjs from "dayjs";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { getDatabase, ref, set, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
const Daily = function () {
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
  const auth = getAuth();
  const database = getDatabase();
  console.log(auth.currentUser.uid);
  const handleFirebaseTest = function () {
    set(ref(database, `${auth.currentUser.uid}/daily`), {
      data: [
        { id: uuid(), content: "TESSST1" },
      ],
    });
  };
    const handleFirebaseUpdateTest = function () {
      update(ref(database, `${auth.currentUser.uid}/daily`), {
        data: [{ id: uuid(), content: "UPDATEEEE" }],
      });
    };

  const itemsFirebase = [
    {
      id: uuid(),
      content:
        "first top prioritiesfirst top prioritiesfirst top prioritiesfirst top prioritiesfirst top prioritiesfirst top prioritiesfirst top priorities",
    },
    { id: uuid(), content: "second top priorities" },
    { id: uuid(), content: "third top priorities" },
    { id: uuid(), content: "fourth top priorities" },
    { id: uuid(), content: "fifth top priorities" },
    { id: uuid(), content: "sixth top priorities" },
    { id: uuid(), content: "seventh top priorities" },
    { id: uuid(), content: "eighth top priorities" },
  ];
  const itemsFirebase2 = [
    { id: uuid(), content: "first reminders" },
    { id: uuid(), content: "second reminders" },
    { id: uuid(), content: "third reminders" },
    { id: uuid(), content: "fourth reminders" },
    { id: uuid(), content: "fifth reminders" },
    { id: uuid(), content: "sixth reminders" },
    { id: uuid(), content: "seventh reminders" },
    { id: uuid(), content: "eighth reminders" },
  ];
  const itemsFirebase3 = [
    { id: uuid(), content: "first to do" },
    { id: uuid(), content: "second to do" },
    { id: uuid(), content: "third to do" },
    { id: uuid(), content: "fourth to do" },
    { id: uuid(), content: "fifth to do" },
    { id: uuid(), content: "sixth to do" },
    { id: uuid(), content: "seventh to do" },
    { id: uuid(), content: "eighth to do" },
  ];
  const itemsFirebase4 = [
    { id: uuid(), content: "first notes" },
    { id: uuid(), content: "second notes" },
    { id: uuid(), content: "third notes" },
    { id: uuid(), content: "fourth notes" },
    { id: uuid(), content: "fifth notes" },
    { id: uuid(), content: "sixth notes" },
    { id: uuid(), content: "seventh notes" },
    { id: uuid(), content: "eighth notes" },
  ];

  const listItemsTest = {
    [uuid()]: {
      name: "top priorities",
      items: itemsFirebase,
    },
    [uuid()]: {
      name: "reminders",
      items: itemsFirebase2,
    },
    [uuid()]: {
      name: "to do",
      items: itemsFirebase3,
    },
    [uuid()]: {
      name: "notes",
      items: itemsFirebase4,
    },
  };
  const classes = [
    { class: "topPriorities", title: "top priorities" },
    { class: "reminders", title: "reminders" },
    { class: "toDo", title: "to do" },
    { class: "notes", title: "notes" },
  ];

  const onDragEnd = function (result, listItems, setListItems) {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceContainer = listItems[source.droppableId];
      const destContainer = listItems[destination.droppableId];
      const sourceItems = [...sourceContainer.items];
      const destItems = [...destContainer.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setListItems({
        ...listItems,
        [source.droppableId]: {
          ...sourceContainer,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destContainer,
          items: destItems,
        },
      });
    } else {
      const listItem = listItems[source.droppableId];
      const copiedItems = [...listItem.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setListItems({
        ...listItems,
        [source.droppableId]: {
          ...listItems,
          items: copiedItems,
        },
      });
    }
  };
  const [listItems, setListItems] = useState(listItemsTest);
  const [itemSize, setItemSize] = useState("");
  const handleDragged = function (e) {
    setItemSize(e.target.dataset.rbdDraggableId);
    console.log(e.target);
    return false;
  };
  const handleDropped = function () {
    setItemSize("");
    console.log("unclick", itemSize);
  };
  return (
    <div className="dailyPlannerMain" onMouseUp={handleDropped}>
      <nav className="wrapperSlim">
        <Link to={"/planner"}>
          <ThemeProvider theme={theme}>
            <Button>back</Button>
          </ThemeProvider>
        </Link>
        <h2>Daily Planner</h2>
        <p className="navDate">date: {dayjs().format("dddd/MM/YYYY")}</p>
      </nav>
      <div className="dailyContainer">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, listItems, setListItems)}
        >
          {Object.entries(listItems).map(function ([id, listItem], index) {
            return (
              <Droppable droppableId={id} key={id}>
                {(provided, snapshot) => {
                  return (
                    <div
                      className={`listContainer${classes[index].class} listContainers`}
                    >
                      <h3>{classes[index].title}</h3>
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#FFF8EE"
                            : "#FFF8EE",
                        }}
                      >
                        {listItem.items.map(function (item, index) {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                // console.log(provided.draggableProps)

                                return (
                                  <li
                                    // onDrag={handleDragged}

                                    onMouseDown={handleDragged}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      width:
                                        itemSize ===
                                        provided.draggableProps[
                                          "data-rbd-draggable-id"
                                        ]
                                          ? "411.33px"
                                          : "100%",
                                      userSelect: "none",
                                      backgroundColor: snapshot.isDragging
                                        ? "#E3E3E3"
                                        : "#FFF8EE",
                                      ...provided.draggableProps.style,
                                      // width:
                                      //   snapshot.isDragging ? "411.33px" : "100%",
                                    }}
                                  >
                                    <p onMouseDown={handleDragged}>
                                      {item.content}
                                    </p>
                                    <div className="options">
                                      <IconButton
                                        onClick={handleFirebaseTest}
                                        aria-label="edit"
                                        size="small"
                                      >
                                        <EditIcon fontSize="inherit" />
                                      </IconButton>
                                      <IconButton
                                        onClick={handleFirebaseUpdateTest}
                                        aria-label="delete"
                                        size="small"
                                      >
                                        <DeleteIcon fontSize="inherit" />
                                      </IconButton>
                                    </div>
                                  </li>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </ul>
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
};

export default Daily;
