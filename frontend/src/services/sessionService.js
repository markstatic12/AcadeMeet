// const API_BASE_URL = 'http://localhost:8080/api';

// /**
//  * Creates a new session by sending data to the backend.
//  * @param {object} sessionData - The session data from the form.
//  * @returns {Promise<object>} The newly created session object from the backend.
//  */
// export const createSession = async (sessionData) => {
//   // In a real app, you'd get a JWT token from localStorage or auth context
//   // const token = localStorage.getItem('user_token'); 

//   const response = await fetch(`${API_BASE_URL}/sessions`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(sessionData)
//   });

//   if (!response.ok) {
//     // Try to parse a specific error message from the backend
//     const errorData = await response.json().catch(() => ({})); // Handle non-JSON errors
//     throw new Error(errorData.message || 'Failed to create session. Please try again.');
//   }

//   // Return the backend's response (e.g., the newly created session with its ID)
//   return await response.json();
// };