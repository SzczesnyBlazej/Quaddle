import axios from 'axios';
import { getCurrentTimeFormatted, getCurrentDateFormatted } from "./Functions";
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

const AddHistoryEvent = async (message, createdBy, taskID) => {
    try {
        const { data: csrfToken } = await axios.get(API_ENDPOINTS.USER_DATA);

        const response = await axios.post(API_ENDPOINTS.CREATE_TASK_HISTORY, {
            task_id: taskID,
            createdBy: createdBy,
            message: message,
            createDate: getCurrentDateFormatted(),
            createHour: getCurrentTimeFormatted(),
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error adding history of tasks:', error);
        return false;
    }
};

export { AddHistoryEvent };
