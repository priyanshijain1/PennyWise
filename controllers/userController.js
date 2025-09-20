const userModel = require('../models/userModel')

// login callback
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email, password })
        if (!user) {
            return res.status(404).send("User Not Found");
        }
        return res.status(200).json({
            success : true,
            user,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
        });
    }
};

const registerController = async (req,res) => {
    try{
        const { email, name, password } = req.body;
        
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists. Please login instead.",
                error: "DUPLICATE_EMAIL"
            });
        }
        
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).json({
            success:true,
            newUser,
        });
    } catch(error){
        // Handle mongoose duplicate key error
        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists. Please login instead.",
                error: "DUPLICATE_EMAIL"
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
                error: "VALIDATION_ERROR"
            });
        }
        
        // Generic error
        res.status(400).json({
            success:false,
            message: "Registration failed. Please try again.",
            error: error.message || "REGISTRATION_FAILED",
        });
    } 
};
module.exports = { loginController, registerController };