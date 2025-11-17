import User from "../Models/userModel.js";
import Conversation from "../Models/conversationModel.js"

const getUserBySearch = async (req, res) => {
    try {
        const search = req.query.search || '';
        const currentUserId = req.user._id;

        const user = await User.find({
            $and : [
                {
                    $or : [
                        {username : {$regex : '.*' + search + '.*' , $options : 'i'}},
                        {fullname : {$regex : '.*' + search + '.*' , $options : 'i'}}
                    ]
                }, {
                    _id : {$ne : currentUserId}
                }
            ]
        }).select("-password").select("email");

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({
            success : false,
            message : error
        });

        console.log(error);
    }
}

const getCurrentChatters = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentChatters = await Conversation.find({
      participants: currentUserId,
    }).sort({ updatedAt: -1 });

    if (!currentChatters.length) return res.status(200).send([]);

    const participantsIds = currentChatters.flatMap((conversation) =>
      conversation.participants.filter(
        (id) => id.toString() !== currentUserId.toString()
      )
    );

    const uniqueParticipantIds = [...new Set(participantsIds)];

    const users = await User.find({
      _id: { $in: uniqueParticipantIds },
    }).select("-password -email");

    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};


export { getUserBySearch, getCurrentChatters };
