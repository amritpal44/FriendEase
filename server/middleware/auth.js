const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
	try {
		// Extracting JWT from request cookies, body or header
		var token;
		try {
			token = req?.cookies?.token;

		} catch (error) {
			return res.status(401).json({
				success: false,
				message: "token not found"
			})
		}

		// If JWT is missing, return 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		try {
			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			
            //added user id to request
            req.user = {};
			req.user._id = decode.id;

            // console.log("req.user._id", req.user._id);
            // console.log("req.user.id", req.user.id);

		} catch (error) {
            console.log("Error in token decode: ", error);
			return res.status(401).json({ 
                success: false, 
                message: "token is invalid" 
            });
		}

		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: `Something Went Wrong While Validating the Token or cookie not found`,
		});
	}
};