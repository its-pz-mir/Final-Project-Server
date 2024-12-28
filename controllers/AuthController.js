const bcrypt = require("bcryptjs");
const User = require("../models/authModel");
const jwt = require("jsonwebtoken");


const addTeacher = async (req, res) => {
    try {
        const { name, email, password, age, nic, department, doj, lad, expertise, landline, phone } = req.body;

        if (!name || !email || !password || !nic || !age || !department || !lad || !expertise || !phone) {
            return res.status(404).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { nic }, { phone }] });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({
                    success: false,
                    message: "Email is already Registered"
                });
            }

            if (existingUser.nic === nic) {
                return res.status(409).json({
                    success: false,
                    message: "NIC is already Registered"
                });
            }

            if (existingUser.phone === phone) {
                return res.status(409).json({
                    success: false,
                    message: "Phone is already Registered"
                });
            }
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPass,
            nic,
            age,
            department,
            doj,
            lad,
            expertise,
            phone,
            landline
        });

        await newUser.save();

        res.status(200).json({
            success: true,
            user: newUser
        });

    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Server error while registering User",
            error: error.message
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "All fields are requried"
            })
        }

        const findEmail = await User.findOne({ email });

        if (!findEmail) {
            return res.status(405).json({
                success: false,
                message: "User is not registered. Please Register first"
            })
        }

        if (!findEmail?.activeStatus) {
            return res.status(501).json({
                success: false,
                message: "Your status is Inactive. Please contact Admin!"
            })
        }

        const comparePass = await bcrypt.compare(password, findEmail?.password);
        if (!comparePass) {
            return res.status(401).json({
                success: false,
                message: "Password does not match."
            })
        }
        const jwtToken = await jwt.sign({ userId: findEmail?.id }, "Usman");
        res.cookie("token", jwtToken, { httpOnly: true })
        res.status(200).json({
            success: true,
            token: jwtToken,
            user: findEmail
        })

    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Server error while registering User",
            error: error.message
        })
    }
}

const getAllUser = async (req, res) => {
    try {

        const findTeachers = await User.find({ admin: false });

        res.status(200).json({
            success: true,
            teachers: findTeachers
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Server error while fetching users",
            error: error.message
        });
    }
};



const delTeacher = async (req, res) => {
    const { id } = req.params
    try {
        const findUser = await User.findByIdAndDelete(id);
        if (!findUser) {
            return res.status(401).json({
                success: false,
                message: "Teacher not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Successfully Deleted"
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Server error while registering User",
            error: error.message
        })
    }
}


const updateTeacherByAdmin = async (req, res) => {
    const { id } = req.params
    try {
        const findUser = await User.findById(id);

        if (!findUser) {
            return res.status(401).json({
                success: false,
                message: "Unable to find the Teacher"
            })
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            name: req.body?.name ? req.body?.name : findUser.name,
            age: req.body?.age ? req.body?.age : findUser.age,
            nic: req.body?.nic ? req.body?.nic : findUser.nic,
            department: req.body?.department ? req.body?.department : findUser.department,
            doj: req.body?.doj ? req.body?.doj : findUser.doj,
            lad: req.body?.lad ? req.body?.lad : findUser.lad,
            expertise: req.body?.expertise ? req.body?.expertise : findUser.expertise,
            phone: req.body?.phone ? req.body?.phone : findUser.phone,
            landline: req.body?.landline ? req.body?.landline : findUser.landline,
            email: req.body?.email ? req.body?.email : findUser.email,
            password: req.body?.password ? req.body?.password : findUser.password,
            activeStatus: req.body?.activeStatus ? req.body?.activeStatus : findUser.activeStatus,

        }, { new: true })

        if (!updatedUser) {
            return res.status(401).json({
                success: false,
                message: "Unable to update the User"
            })
        }
        res.status(200).json({
            success: true,
            user: updatedUser
        })

    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Server error while registering User",
            error: error.message
        })
    }
}

const updateSelf = async (req, res) => {
    const id = req.userId;

    try {
        if (!id) {
            return res.status(404).json({
                success: false,
                message: "Unable to get the Teacher",
            });
        }

        const findUser = await User.findById(id);
        if (!findUser) {
            return res.status(404).json({
                success: false,
                message: "Unable to find the Teacher",
            });
        }

        const updateSelf = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!updateSelf) {
            return res.status(500).json({
                success: false,
                message: "Unable to Update the Teacher",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            user: updateSelf,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while Updating",
            error: error.message,
        });
    }
};


const checkMyAuth = async (req, res) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User is not Authenticated",
            });
        }
        const decodedToken = await jwt.verify(token, "Usman");
        const user = await User.findById(decodedToken?.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Unable to find User"
            })
        }

        res.status(200).json({
            success: true,
            user
        })


    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Server error while Checking Auth",
            error: error.message
        })
    }
}

const logoutController = async (req, res) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User is not Authenticated",
            });
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });

        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Server error while Logging out",
            error: error.message
        })
    }
}

module.exports = { addTeacher, loginUser, getAllUser, delTeacher, updateTeacherByAdmin, updateSelf, checkMyAuth, logoutController };