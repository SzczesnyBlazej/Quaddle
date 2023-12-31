// CalculateData.js
import axios from 'axios';
import { formatDate } from './dateUtils';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

export async function getTaskCounts(user) {

    try {

        const response = await axios.get(API_ENDPOINTS.TASKS);
        const taskData = response.data;

        const today = formatDate(new Date().toLocaleDateString('en-GB')); // Format: dd-mm-yyyy
        const thisWeekStartDate = new Date();
        thisWeekStartDate.setDate(thisWeekStartDate.getDate() - thisWeekStartDate.getDay());
        const thisWeek = formatDate(thisWeekStartDate.toLocaleDateString('en-GB')); // Format: dd-mm-yyyy
        const closedTodayCount = taskData.filter(task => formatDate(task.closeDate) === today).length;
        const closedThisWeekCount = taskData.filter(task => formatDate(task.closeDate) >= thisWeek).length;
        const myPendingCount = taskData.filter(
            task => task.solver === `${user.name}` && task.status !== "Close"
        ).length;
        const allPendingCount = taskData.filter(task => !task.closeDate).length;

        return {
            closedToday: closedTodayCount,
            closedThisWeek: closedThisWeekCount,
            myPending: myPendingCount,
            allPending: allPendingCount,
        };
    } catch (error) {

        return {
            closedToday: 0,
            closedThisWeek: 0,
            myPending: 0,
            allPending: 0,
        };
    }

}


