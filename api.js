import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const fetchMembers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/members`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching members:', error);
        throw error;
    }
};
