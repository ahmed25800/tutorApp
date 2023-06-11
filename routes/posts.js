const express = require("express");
const router = express.Router();
const controller = require("../controllers/PostController");
const isAuth = require("../middlewares/is_auth");
router.post("/posts/add", isAuth, controller.SavePost);
router.delete("/posts/delete/:post_id", isAuth, controller.DeletePost);
router.get("/teacher/posts/:teacher_id", controller.getTeacherPosts);
module.exports = router;
