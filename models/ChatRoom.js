import mongoose, {Schema} from "mongoose";

const ChatRoomSchema = mongoose.Schema(
    {
        sender_id:{
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        receiver_id:{
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

export default ChatRoom;