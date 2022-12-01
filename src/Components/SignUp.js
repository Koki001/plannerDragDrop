import { Link } from "react-router-dom";

const SignUp = function () {
  return (
    <div className="signUpMain">
      <Link to={"/planner"}>
        <button>back</button>
      </Link>
      <h2>Sign Up</h2>
    </div>
  );
};
export default SignUp;
