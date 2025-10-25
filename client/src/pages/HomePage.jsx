import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import LogoHeader from '../components/LogoHeader';
import "../assets/style.css";

const HomePage = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios.get('https://sietqb.onrender.com/api/departments') 
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-container">
      <LogoHeader />
      <Navbar />

      <main>
        <h1>QUESTION BANK OF SIET</h1>
        <h2 style={{ textAlign: 'center' }}>CHOOSE YOUR DEPARTMENT:</h2>

        <div className="department-grid">
          {departments.map((dept, index) => (
            <div key={dept._id} className={`department dept-color-${index % 14}`}>
              <Link to={`/department/${dept._id}`} state={{ name: dept.name }}>
                {dept.name}
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
