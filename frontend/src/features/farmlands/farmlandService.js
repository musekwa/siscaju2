// import axios from "axios";
// import { baseURL } from "..";

// const API_URL = "http://localhost:8080/farmlands";
// // const LOGIN_URL = "http://localhost:8080/login";

// let user = JSON.parse(localStorage.getItem("user"));

// // register user
// const farmlandRegister = async (farmlandData) => {

//   user = JSON.parse(localStorage.getItem("user"));

//   try {
//     // URL pattern: http://localhost:8080/farmlands?farmerId=43rr3h85tds6u8
//     const response = await axios.post(baseURL + `/farmlands?farmerId=${farmlandData.farmerId}`, farmlandData, {
//       headers: {
//         Authorization: `Bearer ${user.token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error("O registo de pomar falhou!");
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

// const farmlandService = {
//   farmlandRegister,
//   //   login,
//   //   logout,
// };

// export default farmlandService;
