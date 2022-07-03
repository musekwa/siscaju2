
// import nodemailer from "nodemailer";
// import config from "../../config/config.js";
// // import 

// // const transporter = nodemailer.createTransport(({
// //   service: "gmail",
// //   auth: {
// //     user: config.email_login,
// //     pass: config.email_password,
// //   },
// // }));




// const resetPasswordTemplate = (user, url) =>{
//     const from = "musekwa2011@gmail.com";
//     const to = user.email;
//     const subject = "Recuperação de password";

//     const text = `Olá ${user?.fullname || user?.email}, ` + 
//         `Apercebemo-nos de que se esqueceu do seu password, lamentamos por isso! ` +
//         `Mas, não se preocupe, siga o seguinte link para criar um novo password: ` +
//         `${url} ` +
//         `Este link vai expirar em 1 hora de tempo. ` +
//         `Musekwa Evariste`;

//     const html = 
//     `<p>Olá ${user?.fullname || user?.email},</p>` + 
//         `<p>Apercebemo-nos de que se esqueceu do seu password, lamentamos por isso!</p>` +
//         `<p>Mas, não se preocupe, siga o seguinte link para criar um novo password:</p>` +
//         `<a href=${url}>${url}</a>` +
//         `<p>Este link vai expirar em 1 hora de tempo</p>` +
//         `<p>Musekwa Evariste</p>`;

//     return { from, to, subject, text, html }
// }

// export {
//     transporter,
//     getPasswordResetURL,
//     resetPasswordTemplate
// }