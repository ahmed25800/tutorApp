const ChatRoom = require("../models/ChatRoom");
const ChatMessage = require("../models/ChatMessage");

export const SendMessage = async (req, res) => {
    let chat_id = req.body.chat_id;
    if(!chat_id){
        const newChatRoom = new ChatRoom({
            sender_id  : req.body.sender_id, receiver_id : req.body.receiver_id,
        });

        try {
             await newChatRoom.save();
             chat_id = newChatRoom._id;
        } catch (error) {
            res.status(409).json({
                message: error.message,
            });
        }
    }

    let chat_message = req.body.message;
    const messageModel = new ChatMessage({
        sender_id:req.body.sender_id,
        receiver_id : req.body.receiver_id,
        chat_id :chat_id,
        message:chat_message,
    });

    try {
        await messageModel.save();
        res.status(201).json(messageModel);
    } catch (error) {
        res.status(409).json({
            message: error.message,
        });
    }
};
export const getChatRoomOfUser = async (req, res) => {
    const user_id = req.params.userId;
    try {
        const chatRoom = await ChatRoom.find({
            $or:[{'sender_id' : user_id} , {'receiver_id' : user_id}]
        }).populate('receiver_id').populate('sender_id');
        res.status(200).json(chatRoom);
    } catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
};

export const getChatMessages = async (req, res) => {
    try {
        const messages = await ChatMessage.find({
            chat_id: req.params.chatId,
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(409).json({
            message: error.message,
        });
    }
};