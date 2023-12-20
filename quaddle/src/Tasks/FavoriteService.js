// FavoriteService.js

import axios from 'axios';
import API_ENDPOINTS from '../ApiEndpoints/apiConfig';

const checkIsTaskFavorite = async (userID, taskID) => {
    try {
        const response = await axios.get(API_ENDPOINTS.FAVORITIES, {
            params: {
                userID: userID,
            },
        });

        const tasks = response.data;
        const isFavorite = tasks.some((favorite) => favorite.favoritesTasksID.includes(taskID));
        return isFavorite;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return false;
    }
};

const toggleTaskFavorite = async (user, task, isTaskFavorite, setIsTaskFavorite) => {
    try {
        const response = await axios.get(API_ENDPOINTS.FAVORITIES, {
            params: {
                userID: user?.id,
            },
        });
        const favorites = response.data;
        const userFavorites = favorites.find((favorite) => favorite.userID === user.id);

        if (userFavorites) {
            const updatedFavorites = {
                ...userFavorites,
                favoritesTasksID: isTaskFavorite
                    ? userFavorites.favoritesTasksID.filter((id) => id !== task.id)
                    : [...userFavorites.favoritesTasksID, task.id],
            };

            await axios.put(API_ENDPOINTS.FAVORITIES + `/${userFavorites?.id}`, updatedFavorites);
        } else {
            const newFavorite = {
                userID: user.id,
                favoritesTasksID: [task.id],
            };

            await axios.post(API_ENDPOINTS.FAVORITIES, newFavorite);
        }

        setIsTaskFavorite(!isTaskFavorite);
    } catch (error) {
        console.error('Error updating favorites:', error);
    }
};

export { checkIsTaskFavorite, toggleTaskFavorite };
