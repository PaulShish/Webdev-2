import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        
        const user = { username, email, password };

        
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                alert('Registration successful!');
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('An error occurred. Please try again.');
        }
    };

return (
    <div className="container">
        <div className="register-form">
            <h1>Sign-up</h1>
            <form onSubmit={handleRegister}>
                <label htmlFor="fullname">Username*</label>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="email">Email*</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password*</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label htmlFor="confirm-password">Confirm Password*</label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit" className="btn">Register</button>
            </form>
            <p>
                Already have an account?{' '}
                <Link to="/" className="login-link">Go to Login</Link> 
            </p>
        </div>

        <div className="logo-section">
            <img src="../images/gymbro.png" alt="Gym Bro Logo" />
            <h1>GYM BRO</h1>
            <p>Fitness Center</p>
        </div>
    </div>
);
};

export default Register;

