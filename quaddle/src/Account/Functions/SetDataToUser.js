// import axios from 'axios';
// import API_ENDPOINTS from "../../ApiEndpoints/apiConfig";
// import { getCurrentDateFormatted, getCurrentTimeFormatted } from "../../Tasks/Functions";

// const setUserData = async (func, userID) => {
//     try {
//         const response = await axios.get(API_ENDPOINTS.USERS + `/${userID}`);
//         const user = response.data;
//         if (user && user.id) {
//             const updatedUser = {
//                 ...user,
//                 [func]: getCurrentDateFormatted() + ', ' + getCurrentTimeFormatted(),
//             };

//             await axios.put(API_ENDPOINTS.USERS + `/${user.id}`, updatedUser);

//         } else {
//             console.log('Error: User data is undefined or does not have an id property.');
//         }

//     } catch (e) {
//         console.log('Error updating date', e);
//     }
// };

// export default setUserData;
