import router from "./index.js";
import { getGlobalStatistics } from "../controllers/statistics.controllers.js";
// import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";

router.route("/statistics").get(getGlobalStatistics);

export default router;
