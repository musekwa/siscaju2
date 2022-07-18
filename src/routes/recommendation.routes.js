import router from "./index.js";
import {
  addRecommendation,

} from "../controllers/recomendation.controllers.js";
import { protect } from "../middleware/authMiddleware.js";

// router.route("/recommendations").get(protect, getMonitorings);
// .post(protect, addMonitoringByVariability);

router
  .route("/recommendations/:variable")
//   .post(protect, addMonitoringReport)
//   .get(protect, getMonitoringReports);
.post(addRecommendation);

export default router;
