const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/is_auth");
const isTutor = require("../middlewares/is_tutor");

const controller = require("../controllers/tutors_controller");
router.get("/", controller.getTutors);
router.post("/subjects", controller.addSubjects);
router.get("/subjects", controller.getSubjects);
router.get("/request", isAuth, controller.getRequests);
router.get("/schedule", isAuth, controller.getSchedule);
router.post("/request/accept/:id", isAuth, isTutor, controller.acceptRequest);
router.post("/request/reject/:id", isAuth, isTutor, controller.rejectRequest);
module.exports = router;
