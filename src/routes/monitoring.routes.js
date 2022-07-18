import router from "./index.js";
import {
  // getMonitorings,
  // addMonitoringByVariability,
  // addMonitoringReport,
  // getMonitoringReports,
  addMonitoringReport2,
  getMonitoringReports2,
  // updateMonitoring,
  // deleteMonitoring,
} from "../controllers/monitoring.controllers.v2.js";
import { protect } from "../middleware/authMiddleware.js";

router
  .route("/monitorings")
  // .get(protect, getMonitorings)
  // .post(protect, addMonitoringByVariability);

router
  .route("/monitorings/:variable")
  .post(protect, addMonitoringReport2)
  .get(protect, getMonitoringReports2);
  // .post(addVariability);

// router.patch("/monitorings/:monitoringId");
// router.delete("/monitorings/:monitoringId");

export default router;
