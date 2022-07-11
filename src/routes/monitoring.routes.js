import router from "./index.js";
import {
  getMonitorings,
  addMonitoringByVariability,
  addVariability,
  // updateMonitoring,
  // deleteMonitoring,
} from "../controllers/monitoring.controllers.js";
import { protect } from "../middleware/authMiddleware.js";

router
  .route("/monitorings")
  .get(protect, getMonitorings)
  .post(protect, addMonitoringByVariability);

router
  .route("/monitorings/:variable")
  // .post(protect, addVariability);
  .post(addVariability);

// router.patch("/monitorings/:monitoringId");
// router.delete("/monitorings/:monitoringId");

export default router;
