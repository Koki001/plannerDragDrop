import WelcomePage from "./Components/WelcomePage";
import SignUp from "./Components/SignUp";
import Planner from "./Components/Planner";
import Daily from "./Components/Daily";
import Weekly from "./Components/Weekly";
import CalendarPage from "./Components/Calendar";
// other imports
import { Routes, Route, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { app, auth } from "./firebase";
import {
  USER_LOGGED_IN,
  USER_NAME,
  USER_ID,
  USER_EMAIL,
  USER_SIGN_OUT,
} from "./slices/userSlice";
import { useDispatch } from "react-redux";
function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  useEffect(
    function () {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(USER_LOGGED_IN(true));
          dispatch(USER_ID(user.uid));
          dispatch(USER_NAME(user.displayName));
          dispatch(USER_EMAIL(user.email));
        } else {
          navigate("/");
        }
      });
    },
    [auth]
  );
  return (
    <div className="App wrapper">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/weekly" element={<Weekly />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </div>
  );
}

export default App;
