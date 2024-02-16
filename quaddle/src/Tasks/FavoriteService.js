// FavoriteService.js

import axios from 'axios';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

const checkIsTaskFavorite = async (userID, taskID) => {
    try {
        const response = await axios.get(API_ENDPOINTS.CHECK_FAVORITE, {
            params: {
                user_id: userID,
                task_id: taskID,
            }
        });
        return response.data.is_favorite;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return false;
    }
};


const toggleTaskFavorite = async (user, task, isTaskFavorite, setIsTaskFavorite) => {
    try {
        const response = await axios.post(API_ENDPOINTS.FAVORITE, {
            user_id: user?.id,
            task_id: task?.id
        });

        setIsTaskFavorite(!isTaskFavorite);
        return response.data;
    } catch (error) {
        return error;
    }
};
export { checkIsTaskFavorite, toggleTaskFavorite };
