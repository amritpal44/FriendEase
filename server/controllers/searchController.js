const hobbyModel = require("../models/hobbyModel");
const userModel = require("../models/userModel");

// Helper function to find hobbies that match the keywords
const getMatchingHobbies = async (keywords) => {
    const matchingHobbies = await hobbyModel.find({
        hobby: { $in: keywords.map(keyword => new RegExp(keyword, 'i')) } // Match each keyword case-insensitively
    }).select('_id');

    return matchingHobbies.map(hobby => hobby._id);
};

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.body;  // The search query from the request
        const page = parseInt(req.body.page) || 1; // Get page from request, default to 1
        const limit = 20; // Number of users per page
        const skip = (page - 1) * limit;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Search query cannot be empty.",
            });
        }

        // Split the query into individual keywords for better matching
        const keywords = query.split(' ').filter(word => word.trim() !== '');

        // Get the hobbies matching the keywords before making the main query
        const matchingHobbies = await getMatchingHobbies(keywords);

        // Build a search condition that checks for any keyword match in username, bio, or hobbies
        const orConditions = keywords.map(keyword => ({
            $or: [
                { userName: { $regex: new RegExp(keyword, 'i') } },
                { bio: { $regex: new RegExp(keyword, 'i') } },
                { hobbies: { $in: matchingHobbies } }  // Hobbies that match any keyword
            ]
        }));

        // Find users matching any of the keyword conditions
        const users = await userModel.aggregate([
            {
                $match: {
                    $or: orConditions  // Match any of the keywords in any field
                }
            },
            {
                $group: {
                    _id: "$_id", // Group by unique user ID
                    userName: { $first: "$userName" },
                    image: { $first: "$image" },
                    bio: { $first: "$bio" },
                    hobbies: { $first: "$hobbies" }
                }
            }
        ])
        .skip(skip)
        .limit(limit);

        // Check if there are any users matching the search query
        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found matching the query.",
            });
        }

        return res.status(200).json({
            success: true,
            users,
            page,
        });

    } catch (error) {
        console.log("Error searching for users:", error);
        return res.status(500).json({
            success: false,
            message: "Error while searching for users. Please try again.",
        });
    }
};
