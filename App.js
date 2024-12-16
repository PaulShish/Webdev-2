import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideBar'; 
import Dashboard from './pages/Dashboard'; 
import AdminProfile from './pages/AdminProfile';
import Registration from './pages/Registration';
import Plan from './pages/Plan'; 
import ViewMembers from './pages/ViewMembers'; 
import Login from './components/Login'; 
import Register from './components/Register'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import './index.css'; 

const App = () => {
  const [members, setMembers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        console.error('Failed to fetch members:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching members:', error.message);
    }
  };

  const handleAddMember = async (newMember) => {
    try {
      const response = await fetch('http://localhost:5000/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      });
      if (response.ok) {
        console.log('Member added successfully');
        await fetchMembers(); 
      } else {
        console.error('Failed to add member:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding member:', error.message);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar /> 
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard members={members} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AdminProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registration"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Registration onAddMember={fetchMembers} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plan"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Plan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-members"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ViewMembers members={members} />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
