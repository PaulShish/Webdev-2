import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import '../styles/ViewMembers.css';

const ViewMembers = () => {
    const [members, setMembers] = useState([]);

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
        <div className="view-members">
            <div className="members-container">
                <div className="members-header">
                    <h1>View Members</h1>
                </div>
                <table className="members-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date of Join</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Plan</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, index) => (
                            <tr key={index}>
                                <td>{member.name}</td>
                                <td>{member.join_date}</td>
                                <td>{member.email}</td>
                                <td>{member.phone}</td>
                                <td>{member.plan}</td>
                                <td>{member.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewMembers;