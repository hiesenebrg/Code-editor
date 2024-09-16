import React, { useState } from "react";
import "./login.css";
import { signIn, signup } from "../api/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleForm = () => {
  
    setIsRegistering(!isRegistering);
  };

  const Login = async () => {
    let res;
    if (!isRegistering) {
      res = await signIn(dispatch, {
        email: email,
        password: password,
      });
    } else {
      res = await signup(dispatch, {
        name: username,
        email: email,
        password: password,
      });
    }

    if (res && res.success) {
      console.log("successs", isRegistering);
      !isRegistering ? navigate("/") : toggleForm();
    }
  };

  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className={`wrapper ${isRegistering ? "active" : ""}`}>
      {/* Background Elements */}
      <span className="rotate-bg"></span>
      <span className="rotate-bg2"></span>

      {/* Login Form */}
      <div className={`form-box login ${isRegistering ? "animation" : ""}`}>
        <h2 className="title animation" style={{ "--i": 0, "--j": 21 }}>
          Login
        </h2>
        <form action="#">
          <div className="input-box animation" style={{ "--i": 1, "--j": 22 }}>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 2, "--j": 23 }}>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button
            onClick={Login}
            type="submit"
            className="btn animation"
            style={{ "--i": 3, "--j": 24 }}
          >
            Login
          </button>
          <div className="linkTxt animation" style={{ "--i": 5, "--j": 25 }}>
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={toggleForm} className="register-link">
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Info Text for Login */}
      <div className={`info-text login ${isRegistering ? "animation" : ""}`}>
        <h2 className="animation font-bold" style={{ "--i": 0, "--j": 20 }}>
          Welcome Back!
        </h2>
        <p className="animation text-sm" style={{ "--i": 1, "--j": 21 }}>
          Experience Team code-editor where you can build projects with Team 
        </p>
      </div>

      {/* Register Form */}
      <div className={`form-box register ${isRegistering ? "animation" : ""}`}>
        <h2 className="title animation" style={{ "--i": 17, "--j": 0 }}>
          Sign Up
        </h2>
        <form action="#">
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Username</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 19, "--j": 2 }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 20, "--j": 3 }}>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
            <i className="bx bxs-lock-alt"></i>
          </div>

          <button
            onClick={Login}
            type="submit"
            className="btn animation"
            style={{ "--i": 21, "--j": 4 }}
          >
            Sign Up
          </button>

          <div className="linkTxt animation" style={{ "--i": 22, "--j": 5 }}>
            <p>
              Already have an account?{" "}
              <a href="#" onClick={toggleForm} className="login-link">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Info Text for Register */}
      <div className={`info-text register ${isRegistering ? "animation" : ""}`}>
        <h2 className="animation font-bold" style={{ "--i": 17, "--j": 0 }}>
          Welcome!
        </h2>
        <p className="animation text-sm" style={{ "--i": 18, "--j": 1 }}>
        Experience Team code-editor where you can build projects with Team 

        </p>
      </div>
    </div>
  );
};

export default Login;
