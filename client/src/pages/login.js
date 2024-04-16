import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Popup from './popup';

const LoginForm = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [doRedirect, setDoRedirect] = useState(false);
  const [status, setStatus] = useState(false);
  const [msg, setMsg] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleClosePopup = (doredirect) => {
    setShowPopup(false);
    if (doredirect) {
      window.location.href = '/';
    }
    
  };

  const { email, password } = formData;

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://bookmart-website.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.status === 201) {
        try{
          const {token} = await response.json();
          sessionStorage.setItem('token', JSON.stringify(token));
          
            if (token) {
              const res = await axios.get('https://bookmart-website.onrender.com/api/auth/fetchusername', {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              const fetchedUsername = res.data.username;
              sessionStorage.setItem('username', fetchedUsername);
        }
        setMsg("Login Succesful!");
          setStatus(true);
          setDoRedirect(true);
          setShowPopup(true);
      }
        catch{
          setMsg("Unable to login. Try again later!");
          
          setShowPopup(true);
          
        }
      } else if (response.status === 400) {
        setMsg("Invalid credentials");
        
        setShowPopup(true);
      } else {
        setMsg("Server error. Please try again later.");
        
        setShowPopup(true);
      }

      
    } catch (error) {
      setMsg("Unable to login. Try again later!");
      
      setShowPopup(true);
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className='container'>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button className='btn-1' type="submit">Login</button>
      </form>
      <div>
        <p> Create new Account?<Link className="nav-link" to="/signup">Signup</Link></p>
      </div>
      {showPopup && (
        <Popup
          message={msg}
          onClose={handleClosePopup}
          status={status}
          doRedirect={doRedirect}
        />
      )}
    </div>
  );
};

export default LoginForm;
