import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';

export async function CountTaskToMenuTaskList(menuName, userid, name) {
    try {
        const response = await axios.get(API_ENDPOINTS.TASKS);
        const favoritesResponse = await axios.get(API_ENDPOINTS.FAVORITIES, {
            params: {
                userID: userid,
            },
        });
        const taskData = response.data;
        const favoritesData = favoritesResponse.data;

        let count = 0;

        switch (menuName) {
            case "MyTasks":
                count = taskData.filter(task => task.clientID == `${userid}` && (task.status === 'Open' || task.status === 'In Pendend')).length;
                break;
            case "myAssignedTasks":
                count = taskData.filter(task => task.solver === `${name}` && (task.status === 'Open' || task.status === 'In Pendend')).length;
                break;
            case "allOpenedTask":
                count = taskData.filter(task => task.status === 'Open').length;
                break;
            case "myClosedTasks":
                count = taskData.filter(task => task.clientID == `${userid}` && task.status === 'Close').length;
                break;
            case "allUnallocated":
                count = taskData.filter(task => task.solver === '' && (task.status === 'Open' || task.status === 'In Pendend')).length;
                break;
            case "AllInPendendTask":
                count = taskData.filter(task => task.status === 'In Pendend').length;
                break;
            case "allClosedTask":
                count = taskData.filter(task => task.status === 'Close').length;
                break;
            case "Favorities":
                count = favoritesData[0].favoritesTasksID.length;
                break;
            default:
                break;
        }

        return count;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

