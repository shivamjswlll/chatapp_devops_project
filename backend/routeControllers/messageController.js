import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageModel.js";
import { getReceiverSocketId, io } from "../Socket/socket.js";

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const {id : receiverId} = req.params;
        const senderId = req.user._id;

        let chats = await Conversation.findOne({
          participants: { $all: [senderId, receiverId] },
        });
        if(!chats)
            chats = await Conversation.create({participants : [senderId, receiverId]});

        const newMessages = new Message({
            senderId,
            receiverId,
            message,
            conversationId : chats._id
        });

        if(newMessages) 
            chats.messages.push(newMessages._id);

        await Promise.all([chats.save(), newMessages.save()]);
        //Socket.io function

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessages);
        }
        res.status(200).send(newMessages);
    } catch (error) {
        console.log(`Error at messageController: ${error}`);
        res.status(500).send({success : false, message : error});
    }
}

const getMessage = async (req, res) => {
    try {
        const {id : receiverId} = req.params;
        const senderId = req.user._id;

        const chats = await Conversation.findOne({participants : {$all : [receiverId, senderId]}}).populate("messages");
        if(!chats) 
            return res.status(200).send([]);

        const message = chats.messages;

        res.status(200).send(message);

    } catch (error) {
        console.log(`Error at getMessage: ${error}`);
        res.status(500).send({ success: false, message: error });
    }
}

export { sendMessage, getMessage };
