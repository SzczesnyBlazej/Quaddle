import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';

async function GetTasksByCustomerId({ clientId, taskStatus }) {
    try {

        const response = await axios.get(API_ENDPOINTS.TASKS, {
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