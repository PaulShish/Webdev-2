import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../index.css';

const Sidebar = () => {
    useEffect(() => {}, []);
  return (
    <div className="sidebar">
      <div className="sidebar-header">
      <h2>Gymbro</h2>
      <p>Admin</p>
      </div>

      
      <ul className="sidebar-links">
        <li>
          <NavLink to="/dashboard" exact activeClassName="active-link">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-profile" activeClassName="active-link">
            Admin Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/registration" activeClassName="active-link">
            Registration
          </NavLink>
        </li>
        <li>
          <NavLink to="/plan" activeClassName="active-link">
            Plan
          </NavLink>
        </li>
        <li>
          <NavLink to="/view-members" activeClassName="active-link">
            View Members
          </NavLink>
        </li>
      </ul>

      
    </div>
  );
};

export default Sidebar;
