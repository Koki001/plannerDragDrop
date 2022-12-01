import * as dayjs from "dayjs";
import { Link } from "react-router-dom";

const Weekly = function () {
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
        <p>stuff here</p>
      </div>
    </div>
  );
};

export default Weekly;
