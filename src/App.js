import WelcomePage from "./Components/WelcomePage";
import SignUp from "./Components/SignUp";
import Planner from "./Components/Planner";
import Daily from "./Components/Daily";
import Weekly from "./Components/Weekly";
// other imports
import { Routes, Route} from "react-router-dom";


function App() {
  return (
    <div className="App wrapper">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/weekly" element={<Weekly />} />
      </Routes>
    </div>
  );
}

export default App;
