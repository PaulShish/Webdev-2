import React, { useState } from 'react';
import '../index.css';
import '../styles/Registration.css';

const Registration = ({ onAddMember }) => {
  const [name, setName] = useState('');
  const [dateOfJoin, setDateOfJoin] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [plan, setPlan] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !dateOfJoin || !email || !contact || !plan || !price) {
      alert('All fields are required!');
      return;
    }

    const memberData = { name, join_date: dateOfJoin, email, phone: contact, plan, price };

    try {
      const response = await fetch('http://localhost:5000/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        alert('Member added successfully!');
        setName('');
        setDateOfJoin('');
        setEmail('');
        setContact('');
        setPlan('');
        setPrice('');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h1>
          Become a Member! <span className="highlight-text">Register</span>
        </h1>
      </div>
      <div className="registration-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name of Participant</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfJoin">Date of Join</label>
              <input
                id="dateOfJoin"
                type="date"
                value={dateOfJoin}
                onChange={(e) => setDateOfJoin(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact">Contact No.</label>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Enter contact number"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="plan">Plan</label>
              <input
                id="plan"
                type="text"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Enter plan"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">
              Avail Membership
            </button>
            <button type="button" className="secondary-button" onClick={() => alert('Cancelled')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;