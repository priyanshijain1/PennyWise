// const userModel = require('../models/userModel')

// // login callback
// const loginController = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         const user = await userModel.findOne({ email, password })
//         if (!user) {
//             return res.status(404).send("User Not Found");
//         }
//         return res.status(200).json({
//             success : true,
//             user,
//         });
//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             error,
//         });
//     }
// };

// const registerController = async (req,res) => {
//     try{
//         const { email, name, password } = req.body;
        
//         // Check if user already exists
//         const existingUser = await userModel.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User with this email already exists. Please login instead.",
//                 error: "DUPLICATE_EMAIL"
//             });
//         }
        
//         const newUser = new userModel(req.body);
//         await newUser.save();
//         res.status(201).json({
//             success:true,
//             newUser,
//         });
//     } catch(error){
//         // Handle mongoose duplicate key error
//         if (error.code === 11000 && error.keyPattern?.email) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User with this email already exists. Please login instead.",
//                 error: "DUPLICATE_EMAIL"
//             });
//         }
        
//         // Handle validation errors
//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map(err => err.message);
//             return res.status(400).json({
//                 success: false,
//                 message: messages.join(', '),
//                 error: "VALIDATION_ERROR"
//             });
//         }
        
//         // Generic error
//         res.status(400).json({
//             success:false,
//             message: "Registration failed. Please try again.",
//             error: error.message || "REGISTRATION_FAILED",
//         });
//     } 
// };
// module.exports = { loginController, registerController };



const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // CREATE JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// REGISTER
const registerController = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = new userModel({ email, name, password });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { loginController, registerController };
