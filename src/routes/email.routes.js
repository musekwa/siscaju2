import router from "./index.js";
import {
  sendPasswordResetEmail,
  receiveNewPassword,
} from "../controllers/email.controllers.js";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";

router.route("/user/:email").get(sendPasswordResetEmail);


router.route("/user/:password").post(receiveNewPassword);

router.route("/user/:password").put(receiveNewPassword); // remove this later (this line must not be kept here)

export default router;
