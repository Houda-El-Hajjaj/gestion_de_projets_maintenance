import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './CSScomponents/Sidebar.css';

const SidebarV = () => {
  return (
    <div>
      <Navbar /> 
      <div className="sidebar">
        <div className="mt-5">
          <ul>
            <li>
              <br />
              <br />
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/projectslist">Projets</Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/userslist">Utilisateurs</Link>
            </li>
          </ul>
          {/* Add more page links here */}
        </div>
      </div>
    </div>
  );
};

export default SidebarV;
