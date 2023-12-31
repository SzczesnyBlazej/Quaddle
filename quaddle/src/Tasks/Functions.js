import axios from 'axios';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

export function getCurrentDateFormatted() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    return `${day}-${month}-${year}`;
}
export function getCurrentTimeFormatted() {
    const currentTime = new Date();

    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export const sendNotification = async (notificationText, taskID) => {

    const getStoredUsername = localStorage.getItem('user');
    const storedUser = JSON.parse(getStoredUsername);
    try {
        await axios.post(API_ENDPOINTS.NOTIFICATION, {
            notificationText: notificationText,
            taskId: taskID,
            notificationDate: getCurrentDateFormatted(),
            notificationTime: getCurrentTimeFormatted(),
            createdBy: storedUser,
        });

    } catch (error) {

        console.error('Error sending notification:', error);
    }
};
export const getStatusIconColor = (status) => {
    return status === 'Open' ? 'orange' : status === 'Close' ? '#00a347' : 'gray';
};


