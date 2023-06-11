import mongoose, {Schema} from "mongoose";

const ChatMessageSchema = mongoose.Schema(
    {
        room_id:{
            type: Schema.Types.ObjectId,
            ref: "ChatRoom",
        },
        sender_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        message: {
            type:String,
            required:true
        },
    },
    { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

export default ChatMessage;