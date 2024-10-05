import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Popup from "./popup";

const SignUpForm = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [doRedirect, setDoRedirect] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const { email, username, password } = formData;

  const handleClosePopup = (doredirect) => {
    setShowPopup(false);
    if (doredirect) {
      navigate("/login");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.status === 201) {
        setMsg("Signup successful");
        setStatus(true);
        setDoRedirect(true);
        setShowPopup(true);
      } else if (response.status === 400) {
        setMsg("User already exists");
        setShowPopup(true);
      } else {
        setMsg("Server error. Please try again later.");
        setShowPopup(true);
      }
    } catch (error) {
      setMsg("Server error. Please try again later.");
      setShowPopup(true);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          minLength="6"
          required
        />

        <button className="btn-1" type="submit">
          Register
        </button>
      </form>
      {showPopup && (
        <Popup
          message={msg}
          onClose={handleClosePopup}
          status={status}
          doRedirect={doRedirect}
        />
      )}
      <div style={{ marginTop: "1.5rem" }}>
        <p>
          {" "}
          Already have an account?
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
