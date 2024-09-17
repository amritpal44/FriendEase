const userModel = require("../models/userModel");

const mongoose = require("mongoose");

exports.getRecommendedUsers = async (req, res) => {
  try {
    const userId = req.user._id; // Convert userId to ObjectId for MongoDB
    const { page = 1, limit = 10 } = req.body;

    // Fetch the current user with friends and potential friends
    const currentUser = await userModel.findById(userId)
      .select('friends potentialFriends friendRequest');

    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure that currentUser.friends and currentUser.friendRequest are arrays
    const friendIds = (currentUser.friends || []).map(friend => friend?.toString()).filter(Boolean);
    const friendRequestIds = (currentUser.friendRequest || []).map(request => {
      if (!request) return null;
      return request.user1?.toString() === userId.toString() 
        ? request.user2?.toString() 
        : request.user1?.toString();
    }).filter(Boolean);

    const excludeIds = [userId.toString(), ...friendIds, ...friendRequestIds];

    let recommendedUsers = [];

    // If there are potential friends, sort them by mutualFriendsCount
    if (currentUser.potentialFriends && currentUser.potentialFriends.length > 0) {
      const sortedPotentialFriends = currentUser.potentialFriends
        .filter(potential => potential.friendId && !excludeIds.includes(potential.friendId.toString())) // Exclude undefined friendId and current friends and requests
        .sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount); // Sort by mutual friends count in descending order

      // Limit to the requested number of users
      recommendedUsers = sortedPotentialFriends.slice(0, limit);
    }

    // If there are not enough recommended users, fill the rest with random users
    const remainingCount = limit - recommendedUsers.length;
    if (remainingCount > 0) {
      const randomUsers = await userModel
        .find({
          _id: { $nin: excludeIds.concat(recommendedUsers.map(user => user.friendId)) }
        })
        .limit(remainingCount)
        .select('userName bio hobbies');
      
      // Append random users to the recommended users
      recommendedUsers = recommendedUsers.concat(randomUsers);
    }

    // Prepare the final list of users to return
    const resultUsers = await userModel.find({
      _id: { $in: recommendedUsers.map(user => new mongoose.Types.ObjectId(user.friendId || user._id)) }
    }).select('userName bio hobbies').populate('hobbies', 'name'); // Populate hobbies

    return res.status(200).json({
      success: true,
      users: resultUsers,
      totalUsers: resultUsers.length,
      totalPages: Math.ceil(resultUsers.length / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};





exports.getRandomUsers = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { page = 1, limit = 10 } = req.body;


    const currentUser = await userModel
      .findById(userId)
      .populate('friends', '_id')
      .populate({
        path: 'friendRequest',
        populate: {
          path: 'user1 user2',
          select: '_id userName', 
        },
      });


    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    //extract friends' IDs
    const friendIds = currentUser.friends?.length > 0 ? currentUser.friends.map(friend => friend._id) : [];

    //extract IDs of users in the friendRequest list
    const friendRequestIds = currentUser.friendRequest?.length > 0
      ? currentUser.friendRequest.map(request => {
          // Check if the current user is user1 or user2 and return the other user
          return request.user1._id.equals(userId) ? request.user2._id : request.user1._id;
        })
      : [];

    //exclude current user, friends, and friend request users
    const excludeIds = [userId, ...friendIds, ...friendRequestIds];

    //console.log("excluded id: ", excludeIds); // Ensure this log is firing and check its value

    // Fetch random users excluding the current user, their friends, and users in friendRequest
    const users = await userModel
      .find({
        _id: { $nin: excludeIds }, //exclude current user, their friends, and friend request users
      })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('userName bio hobbies')
      .exec();

    const totalUsers = await userModel.countDocuments({
      _id: { $nin: excludeIds }, 
    });

    return res.status(200).json({
      success: true,
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getRandomUsers controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
