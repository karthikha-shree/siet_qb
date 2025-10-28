import React from 'react';
import { Link } from 'react-router-dom';
//import "../assets/style.css";
const Navbar = () => (
    <nav>
        
        <ul>
            <li><Link to="/">Home</Link></li>
           
            <li><a href="https://www.siet.ac.in/" target="_blank" rel="noopener noreferrer">Life@Srishakthi</a></li>
            <li><Link to="/admin-login">Admin Login</Link></li>
            
           
        </ul>
    </nav>
);

export default Navbar;
