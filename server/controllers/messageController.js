import messagesModel from "../model/messagesModel.js";
import userModel from "../model/userModel.js"
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../index.js"

export const getUserForSidebar = async (req, res) => {
    try {
        const userid = req.user._id;
        const filterUser = await userModel.find({ _id: { $ne: userid } }).select("-password");
        const unseenMessages = {};
        const promise = filterUser.map(async (user) => {
            const message = await messagesModel.find({ senderId: user._id, recevierId: userid, seen: false });
            if (message.length > 0) {
                unseenMessages[user._id] = message.length;
            }
        })
        await Promise.all(promise);
        res.json({ success: true, users: filterUser, unseenMessages });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//get all messages for selected user
export const getAllMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await messagesModel.find({
            $or: [
                { senderId: myId, recevierId: selectedUserId },
                { senderId: selectedUserId, recevierId: myId }
            ]
        })

        await messagesModel.updateMany({ senderId: selectedUserId, recevierId: myId }, { seen: true });

        res.json({ success: true, messages })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//api mark meesages as seen using message id 
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params.id;
        await messagesModel.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }

}


//send messages to selected user
export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id; // <-- fixed
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadImage.secure_url;
        }

        const message = await messagesModel.create({
            senderId,
            recevierId: receiverId,
            text: text || "",
            image: imageUrl || "",
            seen: false, // fix
        });

        // emit to receiver socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }

        res.json({ success: true, newMessage: message });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
