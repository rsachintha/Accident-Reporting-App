const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const { SECRET } = require("../config");



const userRegister = async (userDetails, role, res) => {
    try {
        let emailNotRegistered = await validateEmail(userDetails.email);
        if (!emailNotRegistered) {
            return res.status(400).json({
                message: "Email is already in use",
                success: false
            })
        }

        const password = await bcrypt.hash(userDetails.password, 12);
        const newUser = new User({
            ...userDetails,
            password,
            role
        });
        await newUser.save();
        return res.status(201).json({
            message: "Now you are successfully registered!",
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: "Unable to create your account",
            success: false
        })
    }
}


const userLogin = async (userCredentials, role, res) => {
    let { email, password } = userCredentials;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "Email is not found",
            success: false
        })
    }
    if (user.role !== role) {
        return res.status(403).json({
            message: "No Access!",
            success: false
        })
    }
    let isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
        let token = jwt.sign(
            {
                user_id: user._id,
                role: user.role,
                name: user.name,
                email: user.email
            },
            SECRET,
            { expiresIn: "7 days" }
        )

        let result = {
            name: user.name,
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 168
        }

        return res.status(200).json({
            ...result,
            message: "You have logged in",
            success: true
        })
    } else {
        return res.status(403).json({
            message: "Incorrect Password!",
            success: false
        })
    }
}


const userAuth = passport.authenticate("jwt", { session: false });


const checkRole = roles => (req, res, next) =>
    !roles.includes(req.user.role)
        ? res.status(401).json("Unauthorized")
        : next();


const validateEmail = async email => {
    let user = await User.findOne({ email });
    return user ? false : true;
};


const serializeUser = user => {
    return {
        name: user.name,
        email: user.email,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
    };
};

module.exports = {
    checkRole,
    userAuth,
    userLogin,
    userRegister,
    serializeUser
}