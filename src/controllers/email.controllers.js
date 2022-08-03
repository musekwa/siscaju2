
import jwt  from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import config from "../../config/config.js";
import nodemailer from 'nodemailer'
import { google } from "googleapis";

import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

// ---------------------------------------------------------------------
// helpers functions

const oAuth2Client = new google.auth.OAuth2(config.client_id, config.client_secret, config.redirect_uri);
oAuth2Client.setCredentials({ refresh_token: config.refresh_token })

const getPasswordResetURL = (user, token) =>{

    if (config.env === 'development') {
        return `${config.host}:3000/password-update/${user._id}/${token}`;
    } 
    else {
        return `${config.host}/password-update/${user._id}/${token}`;
    }
    
}
  

// create email template 
const resetPasswordTemplate = (user, url) => {
  const from = "musekwa2011@gmail.com";
  const to = user.email;
  const subject = "Recuperação de password";

  const text =
    `Olá ${user?.fullname || user?.email}, ` +
    `Apercebemo-nos de que se esqueceu do seu password, lamentamos por isso! ` +
    `Mas, não se preocupe, siga o seguinte link para criar um novo password: ` +
    `${url} ` +
    `Este link vai expirar em 1 hora de tempo. ` +
    `Musekwa Evariste`;

  const html =
    `<!DOCTYPE html>` +
    `<html lang="en"> <head>` +
    `<meta charset="utf-8" />`+
    `<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />`+
    `<meta name="viewport" content="width=device-width, initial-scale=1" />` +
    `<meta name="description" content="Web site created using create-react-app" />`+
    `<link rel="apple-touch-icon" href="apple-touch-icon.png" />`+
    `<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />`+
    `</head> ` +
    `<p>Olá ${user?.fullname || user?.email},</p>` +
    `<p>Apercebemo-nos de que se esqueceu do seu password, lamentamos por isso!</p>` +
    `<p>Mas, não se preocupe, siga o seguinte link para criar um novo password:</p>` +
    `<a href=${url}>${url}</a>` +
    `<p>Este link vai expirar em 1 hora de tempo</p>` +
    `<p>Musekwa Evariste</p>` +
    `</html>`;
  return { from, to, subject, text, html };
};

const usePasswordHashToMakeToken = ({ password: passwordHash,  _id: id,  createdAt,}) =>{
    const secret = passwordHash + "-" + createdAt;
    const token = jwt.sign({ id }, secret, { expiresIn: 3600, })

    return token;
}
// ------------------------------------------------------------------------------------
// controllers

const sendPasswordResetEmail = asyncHandler(async (req, res) =>{
    const { email } = req.params;
    let user = await User.findOne({ email }).exec()
    if (!user) {
        res.status(404);
        throw new Error('Nenhum utilizador associado a este mail!');
    }
    const token = usePasswordHashToMakeToken(user);
    const url = getPasswordResetURL(user, token);
    const emailTemplate = resetPasswordTemplate(user, url);

    const sendEmail = async ()=>{

        try {

            const accessToken = await oAuth2Client.getAccessToken();
           
            const transport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: 'OAuth2',
                    user: 'musekwa2011@gmail.com',
                    clientId: config.client_id,
                    clientSecret: config.client_secret,
                    refreshToken: config.refresh_token,
                    accessToken: accessToken,
                }
            })

            // const mailOptions = {
            //   from: "musekwa <musekwa2011@gmail.com>",
            //   to: "musekwa2019@gmail.com",
            //   subject: "Hello from gamail using API",
            //   text: "Hello fro gmail email using API",
            //   html: "<h1>Hello fro gmail email using API</h1>",
            // };

            const result = await transport.sendMail(emailTemplate);
            return res
                .status(200)
                .json(result);
            
        } catch (error) {
            res.status(error.status || 500);

            throw new Error(error)
        }

    }

    // const sendEmail = () =>{
    //      transporter.sendMail(emailTemplate, (err, info) =>{
    //         if (err) {
    //             res.status(500);
    //             throw new Error(err);
    //         }
    //         console.log(`** Email sent **`, info.response);
    //     })
    // }
    
    sendEmail()
        // .then(result => console.log('Email is sent...', result))
        // .catch(error => console.log(error.message))

});

const receiveNewPassword = asyncHandler(async (req, res)=>{
    const { body } = req;
  
    const user = await User.findOne({ _id: body.userId })

    if (user) {
        const secret = user.password + "-" + user.createdAt;
        const payload = jwt.decode(body.token, secret);

        if (payload.id === user.id) {
            user.password = body.password;;
            await user.save();

            res.status(202).json("Password alterado com sucesso!")
        }
        else {
            res.status(400);
            throw new Error("Utilizador inválido");
        }
    }
})


export { usePasswordHashToMakeToken, sendPasswordResetEmail, receiveNewPassword };