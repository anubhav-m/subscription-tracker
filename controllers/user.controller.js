import User from '../models/user.model.js';

export const getAllUsers = async (req, res, next) => {
    try{

        const currentUser = await User.findById(req.user.id);
        const role = currentUser.role;
        
        if (role === "member"){
            const error = new Error("Unauthorized access - members not authorized");
            error.statusCode = 403; // Forbidden
            throw error;
        }

        const users = await User.find().select('-password'); // Fetch all users excluding the password field
        
        res.status(200).json({
            success: true,
            data: users
        });
    }
    catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
}

export const getUserById = async (req, res, next) => {
    try{
        const currentUser = await User.findById(req.user.id);
        const role = currentUser.role;

        if (role === "member"){
            const error = new Error("Unauthorized access - members not authorized");
            error.statusCode = 403; // Forbidden
            throw error;
        }

        const user = await User.findById(req.params.id).select('-password');

        if (!user){
            const error = new Error("No user found");
            error.statusCode = 404; //Not found
            throw error;
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
}

export const getUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.user.id);
        
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
}