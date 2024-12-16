import React, { useState } from 'react';
import '../index.css';
import '../styles/AdminProfile.css';

const AdminProfile = () => {
  const [username, setUsername] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({ username, contactNo, email }),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setUsername('');
        setContactNo('');
        setEmail('');
      } else {
        const error = await response.json();
        alert(`Failed to update profile: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const error = await response.json();
        alert(`Failed to change password: ${error.error}`);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="admin-profile">
      <h1>Admin Profile</h1>
      <div className="admin-profile-container">


        <div className="password-section">
          <h2>Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <div>
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label>New Password</label>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label>Re-type New Password</label>
              <input
                type="password"
                placeholder="Re-type Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;