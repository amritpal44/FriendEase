//get all, add, remove, accept, reject

const friendshipModel = require("../models/friendshipModel");
const userModel = require("../models/userModel");


//in friendship model: user1 will be the request sender and user2 is the person who received the request
exports.sendFriendRequest = async (req, res) => {
    try {
        const { friendId } = req.body;
        const userId = req.user._id;

        if (userId === friendId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a friend request to yourself.",
            });
        }

        //checking if request already sent
        const alreadySend = await friendshipModel.findOne({
            $or: [
                { user1: userId, user2: friendId },
                { user1: friendId, user2: userId }
            ]
        });
        if(alreadySend){
            return res.status(400).json({
                success: false,
                message: "Friend request already sent"
            })
        }

        //checking if friendship already exists
        const existingFriendship = await userModel.findOne({ 
            _id: userId,
            friends: friendId
        });
        if (existingFriendship) {
            return res.status(400).json({
                success: false,
                message: "You are already friends.",
            });
        }

        //new friendship request
        const friendship = await friendshipModel.create({
            user1: userId,
            user2: friendId,
            status: "pending"
        });

        //adding this to both user and friend so that request can be shown in notification
        await userModel.findByIdAndUpdate(
            userId,
            { $push: { friendRequest: friendship._id } }  
        );
        
        await userModel.findByIdAndUpdate(
            friendId,
            { $push: { friendRequest: friendship._id } }  
        );


        return res.status(200).json({
            success: true,
            message: "Friend request sent successfully."
        });

    } catch (error) {
        console.log("Error sending friend request:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send friend request. Please try again."
        });
    }
};


exports.acceptFriendRequest = async (req, res) => {
    try {
        const { friendshipId } = req.body;
        const userId = req.user._id.toString(); // Convert to string for comparison

        // Find the pending friendship request
        const friendship = await friendshipModel.findOneAndUpdate(
            { _id: friendshipId, user2: userId, status: 'pending' },
            { status: 'accepted' },
            { new: true }
        );

        if (!friendship) {
            return res.status(400).json({
                success: false,
                message: "No pending friendship request found.",
            });
        }

        // Add both users to each other's friends list
        // userId === friendship.user2 (as user1 has sent the request for friendship)
        await userModel.findByIdAndUpdate(userId, {
            $push: { friends: friendship.user1 }
        });
        await userModel.findByIdAndUpdate(friendship.user1, {
            $push: { friends: userId }
        });

        // Remove the friend request entry for both users
        await userModel.findByIdAndUpdate(userId, {
            $pull: { friendRequest: friendshipId }
        });
        await userModel.findByIdAndUpdate(friendship.user1, {
            $pull: { friendRequest: friendshipId }
        });

        // ******************************************************************************************************************************************
        // Update potential friends logic
        const user1 = await userModel.findById(userId).populate("friends");
        const user2 = await userModel.findById(friendship.user1).populate("friends");

        const user1Friends = user1.friends.map(f => f._id.toString());
        const user2Friends = user2.friends.map(f => f._id.toString());

        // Add all friends of user1 to user2's potential friends (excluding already existing friends and self)
        const newPotentialFriendsForUser2 = user1Friends.filter(friendId => 
            !user2Friends.includes(friendId) && friendId !== userId
        );

        await userModel.findByIdAndUpdate(friendship.user1, {
            $addToSet: { potentialFriends: { $each: newPotentialFriendsForUser2 } }
        });

        // Add all friends of user2 to user1's potential friends (excluding already existing friends and self)
        const newPotentialFriendsForUser1 = user2Friends.filter(friendId => 
            !user1Friends.includes(friendId) && friendId !== friendship.user1.toString()
        );

        await userModel.findByIdAndUpdate(userId, {
            $addToSet: { potentialFriends: { $each: newPotentialFriendsForUser1 } }
        });
        // *******************************************************************************************************************************************

        return res.status(200).json({
            success: true,
            message: "Friend request accepted.",
            friendship
        });
    } catch (error) {
        console.log("Error accepting friend request:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to accept friend request. Please try again."
        });
    }
};



//i am still storing the rejected request in friendship db
//so that in future i can add a feature that a user cannot sent request to same user if rejected earlier
exports.rejectFriendRequest = async (req, res) => {
    try {
        const { friendshipId } = req.body;
        const userId = req.user._id;

        //update friendship table
        //checking for user2 in this request is neccessary so that we can validate that no other user is altering the request
        const friendship = await friendshipModel.findOneAndDelete(
            { _id: friendshipId, user2: userId, status: 'pending' },
            { status: 'rejected' },
            { new: true }
        );

        if (!friendship) {
            return res.status(400).json({
                success: false,
                message: "No pending friendship request found.",
            });
        }

        //remove the request from both users' friendRequest arrays
        await userModel.findByIdAndUpdate(userId, { $pull: { friendRequest: friendshipId } });
        await userModel.findByIdAndUpdate(friendship.user1, { $pull: { friendRequest: friendshipId } });

        return res.status(200).json({
            success: true,
            message: "Friend request rejected.",
        });
    } catch (error) {
        console.log("Error rejecting friend request:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject friend request. Please try again."
        });
    }
};


exports.removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const userId = req.user._id;

        //find and delete the friendship entry
        const friendship = await friendshipModel.findOneAndDelete({
            $or: [
                { user1: userId, user2: friendId, status: 'accepted' },
                { user1: friendId, user2: userId, status: 'accepted' }
            ]
        });

        if (!friendship) {
            return res.status(400).json({
                success: false,
                message: "No friendship found.",
            });
        }

        // Remove the friend from both users' friends list
        await userModel.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
        await userModel.findByIdAndUpdate(friendId, { $pull: { friends: userId } });


        //******************************************************************************************************************************************* */

        // Get the friends of both users
        const user1 = await userModel.findById(userId).populate("friends");
        const user2 = await userModel.findById(friendId).populate("friends");

        const user1Friends = user1.friends.map(f => f._id.toString());
        const user2Friends = user2.friends.map(f => f._id.toString());

        // Find mutual friends
        const mutualFriends = user1Friends.filter(friend => user2Friends.includes(friend));

        // Remove the mutual friends from potential friends list for both users
        await userModel.findByIdAndUpdate(userId, {
            $pull: { potentialFriends: { $in: mutualFriends } }
        });

        await userModel.findByIdAndUpdate(friendId, {
            $pull: { potentialFriends: { $in: mutualFriends } }
        });

        //******************************************************************************************************************************************* */



        return res.status(200).json({
            success: true,
            message: "Friend removed successfully."
        });
    } catch (error) {
        console.log("Error removing friend:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove friend. Please try again."
        });
    }
};


exports.getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        
        const user = await userModel.findById(userId)
            .populate({
                path: 'friendRequest',
                match: { status: 'pending' },
                populate: { 
                    path: 'user1', select: 'userName' 
                } // sender data
            });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        // Filter out friend requests where user1 is the current user
        const filteredFriendRequests = user.friendRequest.filter(request => {
            return request.user1._id.toString() !== userId.toString();
        });

        return res.status(200).json({
            success: true,
            friendRequests: filteredFriendRequests
        });
    } catch (error) {
        console.log("Error fetching friend requests:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch friend requests. Please try again."
        });
    }
};


exports.getFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        //console.log("user id" , userId);

        //populate the user friends field
        const user = await userModel.findById(userId).populate('friends', 'userName image bio hobbies');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            friends: user.friends
        });
    } catch (error) {
        console.log("Error fetching friends:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch friends. Please try again."
        });
    }
};
