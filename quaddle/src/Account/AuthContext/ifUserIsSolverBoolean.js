import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';

const getAllUsers = async () => {
    try {
        const response = await axios.get(API_ENDPOINTS.USERS);
        return response.data.map(user => ({
            id: user.id,
            isSolver: user.isSolver
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

const ifUserIsSolverBoolean = async (userIdToCheck) => {

    try {
        const users = await getAllUsers();
        const foundUser = users.find(user => user.id === userIdToCheck) || null;
        const isSolver = foundUser ? foundUser.isSolver : false;
        // console.log(isSolver)
        return isSolver;
    } catch (error) {
        console.error('Error finding user by ID:', error);
        return false;
    }
};

export default ifUserIsSolverBoolean;
