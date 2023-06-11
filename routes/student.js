const express = require("express");
const router = express.Router();
const controller = require("../controllers/student_controller");
const isAuth = require("../middlewares/is_auth");
router.post("/request", isAuth, controller.addRequest);
router.delete("/request/:requestId", isAuth, controller.cancelRequest);
router.get("/request", isAuth, controller.getRequests);
router.post("/report", isAuth, controller.report);
module.exports = router;
