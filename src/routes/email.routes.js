import router from "./index.js";
import {
  sendPasswordResetEmail,
  receiveNewPassword,
} from "../controllers/email.controllers.js";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";

router.route("/user/:email").get(sendPasswordResetEmail);

router.route("/user/:userId/:password/:token").post(receiveNewPassword);


export default router;
