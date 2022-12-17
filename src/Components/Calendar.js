import Calendar from "react-calendar";
import * as dayjs from "dayjs";
import { useState } from "react";
const CalendarPage = function () {
  const [calendarValue, setCalendarValue] = useState(new Date());
  // console.log(day)
  const handleDayClick = function(e){
    console.log(e)
  }
  const handleCalendarChange = function(e){
    setCalendarValue(e)
  }
  const handleClick = function(e){
    console.log(e)
  }
  return (
    <div className="calendarMain">
      <div className="calendarContainer">
        <Calendar
          calendarType="US"
          view="month"
          minDetail="month"
          maxDetail="month"
          onChange={handleCalendarChange}
          value={calendarValue}
          formatShortWeekday={(locale, date) => dayjs(date).format("dddd")}
          nextLabel="month >"
          nextAriaLabel="Go to next month"
          next2Label="year >>"
          next2AriaLabel="Go to next year"
          prevLabel="< month"
          prevAriaLabel="Go to prev month"
          prev2Label="<< year"
          prev2AriaLabel="Go to prev year"
          onClickDay={handleDayClick}
          // tileContent={({activeStartDate, date, view}) => {
          //   return view === "month" && date.getDay() === 1 ?
          //   <p>testing</p>
          //   : null
          // }}
        />
      </div>
    </div>
  );
};
export default CalendarPage;
