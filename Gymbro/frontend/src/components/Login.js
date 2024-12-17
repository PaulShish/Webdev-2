import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const user = { email, password };

        
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username); 
                localStorage.setItem('email', data.email);
                setIsAuthenticated(true);
                alert(`Welcome, ${data.username}!`);
                navigate('/dashboard');
            }
             else {
                const errorData = await response.json();
                alert(`Login failed: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="login-form">
                <h1>Sign-in</h1>
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Email*</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password*</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn">Login</button>
                    <p>
                        Don’t have an account? <a href="/register" onClick={() => navigate('/register')}>Register here</a>
                    </p>
                </form>
            </div>

            <div className="logo-section">
                <img
                    src="../images/gymbro.png"
                    alt="Gym Bro Logo"
                />
                <h1>GYM BRO</h1>
                <p>Fitness Center</p>
            </div>
        </div>
    );
};

export default Login;
