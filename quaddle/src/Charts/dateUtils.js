// // dateUtils.js
// export function formatDate(dateString) {
//     if (!dateString) {
//         return ''; // Return an empty string for empty dates
//     }

//     const parts = dateString.split(/[-/]/);
//     if (parts.length === 3) {
//         const day = parseInt(parts[0], 10);
//         const month = parseInt(parts[1], 10);
//         const year = parseInt(parts[2], 10);

//         if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
//             return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
//         }
//     }

//     return 'Invalid Date';
// }
