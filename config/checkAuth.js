const jwt = require("jsonwebtoken");
const User = require("../models/authModel")

const checkAuth = async (req, res, next) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User is not Authenticated",
            });
        }
        const decodedToken = await jwt.verify(token, "Usman");
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({
                success: false,
                message: "Token has expired, please log in again",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

const isAdmin = async (req, res, next) => {
    const id = req.userId;
    try {
        const checkAdmin = await User.findById(id);
        if (!checkAdmin) {
            return res.status(401).json({
                success: false,
                message: "Unable to find the Admin",
            });
        }

        if (!checkAdmin?.admin) {
            return res.status(401).json({
                success: false,
                message: "You are not an Admin",
            });
        }

        // If the user is an admin, proceed to the next middleware or route
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};


module.exports = { checkAuth, isAdmin };


