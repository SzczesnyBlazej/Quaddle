import axios from 'axios';

async function GetTasksByCustomerId({ clientId, taskStatus }) {
    try {
        const response = await axios.get(`http://localhost:3502/tasks`, {
            params: {
                clientID: clientId,
                status: taskStatus,
                _limit: 8,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error.response || error);
        return [];
    }
}

export default GetTasksByCustomerId;