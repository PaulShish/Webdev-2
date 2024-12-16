import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import '../styles/Plan.css'; 

const Plan = () => {
    const [plans, setPlans] = useState([]);
    const [planName, setPlanName] = useState('');
    const [validity, setValidity] = useState('');
    const [amount, setAmount] = useState('');
    const [available, setAvailable] = useState('');

    const fetchPlans = async () => {
        try {
            const response = await axios.get('http://localhost:5000/plans', {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            setPlans(response.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handleAddPlan = async (e) => {
        e.preventDefault();

        if (!planName || !validity || !amount || !available) {
            alert('All fields are required!');
            return;
        }

        const newPlan = { name: planName, validity, amount, available };

        try {
            const response = await axios.post('http://localhost:5000/plans', newPlan, {
                headers: { Authorization: localStorage.getItem('token') },
            });

            if (response.status === 201) {
                alert('Plan added successfully!');
                fetchPlans(); 
                setPlanName('');
                setValidity('');
                setAmount('');
                setAvailable('');
            } else {
                alert('Failed to add plan!');
            }
        } catch (error) {
            console.error('Error adding plan:', error.response || error.message);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    return (
        <div className="plan">
            <div className="plan-card">
                <h2>Add Plan</h2>
                <form onSubmit={handleAddPlan}>
                    <div className="form-group">
                        <label htmlFor="planName">Plan Name</label>
                        <input
                            id="planName"
                            type="text"
                            placeholder="Enter plan name"
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="validity">Validity (Months)</label>
                        <input
                            id="validity"
                            type="number"
                            placeholder="Enter validity in months"
                            value={validity}
                            onChange={(e) => setValidity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="available">Available Stock</label>
                        <input
                            id="available"
                            type="number"
                            placeholder="Enter available stock"
                            value={available}
                            onChange={(e) => setAvailable(e.target.value)}
                            required
                        />
                    </div>
                    <div className="buttons">
                        <button type="submit" className="save-button">Save</button>
                        <button type="button" className="cancel-button" onClick={() => alert('Action canceled!')}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <div className="plan-card">
                <h2>Existing Plans</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Plan Name</th>
                            <th>Validity (Months)</th>
                            <th>Amount (₱)</th>
                            <th>Available</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan) => (
                            <tr key={plan.id}>
                                <td>{plan.name}</td>
                                <td>{plan.validity}</td>
                                <td>{plan.amount}</td>
                                <td>{plan.available}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Plan;
