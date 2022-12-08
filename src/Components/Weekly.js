import * as dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Weekly = function () {
  const dragRef = useRef();
  let offsetX;
  let offsetY;
  const handleDragClick = function (e) {};
  const dragging = function (e) {
    const el = e.target;
    el.style.left = `${e.pageX - offsetX}px`;
    el.style.top = `${e.pageY - offsetY}px`;
  };
  const handleDragStart = function (e) {
    const el = e.target;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    el.addEventListener("mousemove", dragging);
  };
  const handleDragEnd = function (e) {
    const el = e.target;
    el.removeEventListener("mousemove", dragging);
  };
  return (
    <div className="weeklyMain">
      <nav className="wrapperSlim">
        <Link to={"/planner"}>
          <button>back</button>
        </Link>
        <h2>Weekly Planner</h2>
        <p className="navDate">date: {dayjs().format("dddd/MM/YYYY")}</p>
      </nav>
      <div className="weeklyContainer">
        <div
          ref={dragRef}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onClick={handleDragClick}
          className="dragTest"
          // style={{
          //   position: "relative",
          //   top: mousePosition.y,
          //   left: mousePosition.x,
          // }}
        >
          
        </div>
      </div>
    </div>
  );
};

export default Weekly;
