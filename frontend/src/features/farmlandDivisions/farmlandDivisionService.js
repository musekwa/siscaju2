// import axios from "axios";
// import { baseURL } from "..";

// const API_URL = "http://localhost:8080/farmlands";
// // const LOGIN_URL = "http://localhost:8080/login";

// let user = JSON.parse(localStorage.getItem("user"));

// // register farmland division
// const farmlandDivisionRegister = async (divisionData) => {
//   user = JSON.parse(localStorage.getItem("user"));

//   try {
//     // URL pattern: http://localhost:8080/farmlands/:farmelandId/divisions
//     const response = await axios.post(
//       baseURL + `farmlands/${divisionData.farmlandId}/divisions`,
//       divisionData,
//       {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error("O registo da divisão falhou!");
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

// const farmlandDivisionService = {
//   farmlandDivisionRegister,
//   //   login,
//   //   logout,
// };

// export default farmlandDivisionService;
