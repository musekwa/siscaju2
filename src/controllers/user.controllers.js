import User from "../models/user.model.js";
import mongoose from "mongoose";
import _ from "lodash";
import expressValidator from "express-validator";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/authMiddleware.js";
const { body, validationResult } = expressValidator;
import asyncHandler from "express-async-handler";

const ObjectId = mongoose.Types.ObjectId;

//@desc login
//@route
//@access
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOneAndUpdate({ email }, { $inc: { loginCount: 1 }}, { new: false });
  if (user && (await bcrypt.compare(password, user.password))) {
    return res
      .status(201)
      .type("application/json")
      .json({
        fullname: user.fullname,
        address: user.address,
        email: user.email,
        role: user.role,
        _id: user._id,
        createdAt: user.createdAt,
        token: generateToken(user._id),
      });
  } else {
    res.status(400);
    throw new Error("Credenciais invalidas");
  }
});

//@desc login
//@route
//@access
const register = asyncHandler(async (req, res) => {
  const user = new User(req.body);

  let foundUser = await User.findOne({ email: user.email });

  if (foundUser) {
    res.status(409);
    throw new Error("Este utilizador já foi registado!");
  }

  let savedUser = await user.save();

  return res
    .status(201)
    .type("application/json")
    .json({
      fullname: savedUser.fullname,
      address: savedUser.address,
      email: savedUser.email,
      role: savedUser.role,
      _id: savedUser._id,
      createdAt: savedUser.createdAt,
      token: generateToken(savedUser._id),
    });
});

const changePassword = asyncHandler(async (req, res)=>{
  const { email, oldPassword, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error(`Nenhum utizador está associado a este email`);
  }

   if (user && (await bcrypt.compare(oldPassword, user.password))) {
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      fullname: savedUser.fullname,
      address: savedUser.address,
      email: savedUser.email,
      role: savedUser.role,
      _id: savedUser._id,
      createdAt: savedUser.createdAt,
      token: generateToken(savedUser._id),
    });
   }
   else {
    res.status(400);
    throw new Error("Alteração de password falhou");
   }

})

//@desc
//@route
//@access
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

//@desc: get users by their roles
//@route
//@access
const getUsers = asyncHandler(async (req, res) => {
  const {
    query: { role },
    user,
  } = req;

  let users = await User.find({ role: role });
  if (!users) {
    res.status(404);
    throw new Error(`Nenhum ${role} encontrado`);
  }
  return res.status(200).json(users);
});

//@desc
//@route
//@access
const addUser = asyncHandler(async (req, res) => {
  const { body } = req;
  const newUser = new User(body);
  let savedUser = await newUser.save();

  const { fullname, address, email, role, _id, createdAt } = savedUser;
  return res.status(201).json({
    fullname,
    address,
    email,
    role,
    _id,
    createdAt,
    token: generateToken(savedUser._id),
  });
});

//@desc: get a user by they id
//@route
//@access
const getUserById = asyncHandler(async (req, res) => {
  const {
    params: { userId },
  } = req;

  let foundUser = await User.findById(ObjectId(userId)).select("-password");
  if (!foundUser) {
    res.status(404);
    throw new Error("Este utilizador nao existe");
  }
  res.status(200).json(foundUser);
});

//@desc
//@route
//@access
const updateUser = asyncHandler(async (req, res) => {
  const {
    body,
    params: { userId },
  } = req;
  let updatedUser = await User.findOneAndUpdate(
    { _id: ObjectId(userId) },
    body,
    { runValidators: true, new: true }
  );
  if (!updatedUser) {
    res.status(400);
    throw new Error("Este utilizador nao existe");
  }
  res.status(200).json(updatedUser);
});

//@desc
//@route
//@access
const deleteUser = asyncHandler(async (req, res) => {
  const {
    params: { userId },
  } = req;
  let deletionResult = await User.deleteOne({ _id: ObjectId(userId) });
  res
    .status(204)
    .json({ message: "Utilizador eliminado", data: deletionResult });
});

export {
  login,
  register,
  changePassword,
  addUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
};
