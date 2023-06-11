const express = require("express");
const router = express.Router();
const controller = require("../controllers/PostController");
const isAuth = require("../middlewares/is_auth");
router.post("/add", isAuth, controller.SavePost);
router.delete("/delete/:post_id", isAuth, controller.DeletePost);
router.get("/:teacher_id", controller.getTeacherPosts);
module.exports = router;
