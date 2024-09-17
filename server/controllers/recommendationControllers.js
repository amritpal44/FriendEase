const userModel = require("../models/userModel");

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
