import axios from 'axios';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

export function getCurrentDateFormatted() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    return `${year}-${month}-${day}`;
}
export function getCurrentTimeFormatted() {
    const currentTime = new Date();

    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export const sendNotification = async (notificationText, taskID, user) => {

    try {
        const { data: csrfToken } = await axios.get(API_ENDPOINTS.USER_DATA);
        await axios.post(API_ENDPOINTS.CREATE_NOTIFICATION, {
            notificationText: notificationText,
            taskId: taskID,
            notificationDate: getCurrentDateFormatted(),
            notificationTime: getCurrentTimeFormatted(),
            createdBy: user,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        });

    } catch (error) {

        console.error('Error sending notification:', error);
    }
};
export const getStatusIconColor = (status) => {
    return status === 7 ? 'orange' : status === 8 ? '#00a347' : 'gray';
};


