import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from 'react-bootstrap/NavDropdown';

function CollapsibleExample() {
  const [username, setUsername] = useState('');  
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLinkClick = () => {
    setExpanded(false); 
  };

  const handleLogout = () => {
    handleLinkClick();
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    setUsername('');
    navigate('/login');
  }

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUsername = sessionStorage.getItem('username');
      setUsername(storedUsername || '');
    };
    handleStorageChange();
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" expanded={expanded}>
      <Container>
        <Navbar.Brand href="#home">College Bookmart</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" onClick={handleLinkClick} to="/">
              Home
            </Link>
            <Link className="nav-link" onClick={handleLinkClick} to="/stationery">
              Stationery
            </Link>
            <Link className="nav-link" onClick={handleLinkClick} to="/printout">
              Printout
            </Link>
            <Link className="nav-link" onClick={handleLinkClick} to="/cart">
              Cart
            </Link>
            <Link className="nav-link" onClick={handleLinkClick} to="/orders">
              Orders
            </Link>
            {username ? (
              <NavDropdown title={username} id="username-dropdown">
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Link className="nav-link" onClick={handleLinkClick} to="/login">
                Login
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;
