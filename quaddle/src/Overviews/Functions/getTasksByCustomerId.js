import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';
import { useNotification } from '../../Functions/NotificationContext';

async function GetTasksByCustomerId({ clientId, taskStatus }) {
    const showNotification = useNotification();

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
        showNotification('Error fetching tasks:', error.response || error);

        return [];
    }
}

export default GetTasksByCustomerId;