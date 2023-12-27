import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';

const getSolverList = async () => {
    try {
        const response = await axios.get(API_ENDPOINTS.USERS, {
            params: {
                isSolver: true,
            },
        });
        return response.data.map(user => user.name);

    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export default getSolverList;
