import router from "./index.js";
import {
  sendPasswordResetEmail,
  receiveNewPassword,
} from "../controllers/email.controllers.js";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";

router.route("/user/:email").get(sendPasswordResetEmail);


router.route("/user/:password").post(receiveNewPassword);


export default router;
