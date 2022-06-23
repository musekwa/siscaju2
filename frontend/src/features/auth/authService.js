// import axios from "axios";
// import { baseURL } from "..";

// const API_URL = "http://localhost:8080/users";
// const LOGIN_URL = "http://localhost:8080/login";

// // register user
// const register = async (userData) => {
//     const response = await axios.post(baseURL + "/users", userData);
//     if (response.data) {
//       localStorage.setItem("user", JSON.stringify(response.data));
//     }
//     return response.data;
// };

// // login user
// const updateRegister = async (userData) => {
//   try {
//     const response = await axios.post(baseURL + "/login", userData);
//     if (response.data) {
//       localStorage.setItem("user", JSON.stringify(response.data));
//     }
//     return response.data;
//   } catch (error) {
//     throw new Error("O login falhou!");
//   }
// };

// // login user
// const login = async (userData) => {
//   const response = await axios.post(baseURL + "/login", userData);
//   // const response = await axios.get("https://dummyjson.com/users");
//   if (response.data) {
//     localStorage.setItem("user", JSON.stringify(response.data));
//   }

//   return response.data;
// };

// // logout user
// const logout = async () => {
//   localStorage.removeItem("user");
// };

// const authService = {
//   register,
//   login,
//   logout,
// };

// export default authService;
