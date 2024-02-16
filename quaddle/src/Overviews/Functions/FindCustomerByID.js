import axios from 'axios';
import API_ENDPOINTS from '../../ApiEndpoints/apiConfig';

const getAllUsers = async () => {
    try {
        const response = await axios.get(API_ENDPOINTS.USERS_LIST);
        return response.data.map(user => ({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            initials: user.initials,
            logo_color: user.logo_color,
            is_admin: user.is_admin
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};


const findCustomerById = async (customerId) => {
    try {
        const users = await getAllUsers();
        const foundUser = users.find(user => user.id === customerId) || null;
        return foundUser;
    } catch (error) {
        console.error('Error finding customer by ID:', error);
        return null;
    }
};

export default findCustomerById;


