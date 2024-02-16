import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';

async function GetTasksByCustomerId({ clientId, taskStatus }) {

    try {

        const response = await axios.get(API_ENDPOINTS.TASK_API, {
            params: {
                client_id: clientId,
                status: taskStatus,
            },
        });
        return response.data;
    } catch (error) {
        console.log('Error fetching tasks:', error.response || error)

        return [];
    }
}

export default GetTasksByCustomerId;