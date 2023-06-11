const express = require("express");
const router = express.Router();
const controller = require("../controllers/ChattingController");
const isAuth = require("../middlewares/is_auth");
router.post("/message/send", isAuth, controller.SendMessage);
router.delete("/chats/:userId", isAuth, controller.getChatRoomOfUser);
router.get("/messages/:chatId", controller.getChatMessages);
module.exports = router;
