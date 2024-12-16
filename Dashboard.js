import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    console.log('Username:', storedUsername); 
    console.log('Email:', storedEmail); 
    setUsername(storedUsername || 'Administrator'); 
    setEmail(storedEmail || 'admin@example.com'); 
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/members', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-widgets">
        <div className="widget user-info-widget">
          <h3>{username}</h3>
          <p>{email}</p>
        </div>
      </div>

      <div className="active-members-section">
        <h2>Active Members</h2>
        <ul className="active-members-list">
          {members.length > 0 ? (
            members.map((member, index) => (
              <li key={index} className="active-member-item">
                <span className="member-name">{member.name}</span>
                <span className="member-status">Active</span>
              </li>
            ))
          ) : (
            <li className="no-members">No active members</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
