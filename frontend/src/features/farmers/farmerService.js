
// import axios from "axios";
// import { baseURL } from "..";

// const API_URL = "http://localhost:8080/farmers";
// // const LOGIN_URL = "http://localhost:8080/login";

// let user = JSON.parse(localStorage.getItem("user"));

// // register user
// const addFarmer = async (farmerData) => {
  
//     user = JSON.parse(localStorage.getItem("user"));
//     try {
//         const response = await axios.post(baseURL + "/farmers", farmerData, {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         });
//         return response.data;
//     }
//     catch(error) {
//         throw new Error("O registo de produtor falhou!")
//     }
// };


// const getFarmers = async () => {
//   user = JSON.parse(localStorage.getItem("user"));
//   try {
//     const response = await axios.post(baseURL + "/farmers", {
//       headers: {
//         Authorization: `Bearer ${user.token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("A extracção de produtores falhou!");
//   }
// };

// // login user
// // const updateRegister = async (userData) => {
// //   try {
// //     const response = await axios.post(LOGIN_URL, userData);
// //     if (response.data) {
// //       localStorage.setItem("user", JSON.stringify(response.data));
// //     }
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("O login falhou!");
// //   }
// // };

// // login user
// // const login = async (userData) => {
// //   const response = await axios.post(LOGIN_URL, userData);
// //   // const response = await axios.get("https://dummyjson.com/users");
// //   if (response.data) {
// //     localStorage.setItem("user", JSON.stringify(response.data));
// //   }

// //   return response.data;
// // };

// // logout user
// // const logout = async () => {
// //   localStorage.removeItem("user");
// // };

// const farmerService = {
//   // farmerRegister,
//   addFarmer,
//   getFarmers,
// //   login,
// //   logout,
// };

// export default farmerService;
