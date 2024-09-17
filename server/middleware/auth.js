const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
    try {
        // Extract JWT from request cookies, body, or Authorization header
        let token;

        // Extract token from the request body, if available
        if (req.body?.token) {
            token = req.body.token.replace(/^"|"$/g, ''); // Remove surrounding double quotes
        } 
        // Extract token from Authorization header
        else if (req.headers.authorization) {
            let authHeader = req.headers.authorization;

            // Check if header starts with "Bearer "
            if (authHeader.startsWith("Bearer ")) {
                // Extract the token and remove any extra quotes
                token = authHeader.split(" ")[1].replace(/^"|"$/g, '');
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Authorization header is malformed",
                });
            }
        } 
        // If no token is found, return an error
        else {
            return res.status(401).json({
                success: false,
                message: "Token not found in headers, body, or cookies",
            });
        }

        // If no token was successfully extracted, return 401
        if (!token) {
            return res.status(401).json({ success: false, message: `Token Missing` });
        }

        // Verify the token and extract user info
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            
            // Add the user ID to the request object
            req.user = { _id: decoded.id };
        } catch (error) {
            console.log("Error in token decoding: ", error);
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
};
