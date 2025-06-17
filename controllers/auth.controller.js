import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { JWT_SECRET, JWT_EXPIRY } from "../config/env.js";

//req -> req.body is an object containing data from the client
//res -> res is used to send back data to client
//next -> used to pass errors to middlewares or call the next middleware in the stack


//mongo : database(db name) -> collection(like a table) -> documents(entries, like rows in a table)
export const signUp = async (req, res, next) => {
    // Logic for user sign-up
    const session = await mongoose.startSession(); // Start a new session for transaction(for atomic operations-all or nothing)(it has nothing to do with user session)
    session.startTransaction();//await not used here since it is synchronous (does not return a promise)

    try{
        const { name, email, password } = req.body;
        
        //Check if a user already exists
        const existingUser = await User.findOne({email});
        if (existingUser){
            const error = new Error("User already exists");
            error.statusCode = 409; // Conflict
            throw error; // Throw error to be caught by the catch block
        }

        //Hash password
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt
        
        // Create a new user
        const newUser = await User.create([{name, email, password: hashedPassword}], { session }); // Use the session for transaction //array is used since it is better for transactions in mongoose

        //JSON Web Token (JWT) creation: (it is necessary to protect backend as anybody can open POSTMAN and send request to backend and get resources)
        const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRY}); // Create a token with user ID and secret key, expires in 1 day

        // If user creation is successful, commit the transaction
        await session.commitTransaction();
        session.endSession(); // End the session (this does not return a promise therefore no await)
        
        res.status(201).json({ // Send response with status code 201 (Created)
            success: true, // Indicate success
            message: "User created successfully",
            data: {token, users: newUser[0]} // Send the token and user data in the response
        });
    }
    catch(error){
        await session.abortTransaction(); // Rollback transaction in case of error (this returns a promise therefore await)
        session.endSession(); // End the session (this does not return a promise therefore no await)
        next(error); // Pass the error to the error handling middleware
    }
}

export const signIn = async (req, res, next) => {
    // Logic for user sign-in
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});
        
        if(!user){
            const error = new Error("User not found");
            error.statusCode = 404; // Not Found
            throw error;
        }

        //Password verification
        const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password in the database

        if(!isPasswordValid){
            const error = new Error("Invalid password");
            error.statusCode = 401; // Unauthorized
            throw error;
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRY}); // Create a token with user ID and secret key, expires in 1 day

        res.status(200).json({ // Send response with status code 200 (OK)
            success: true, // Indicate success
            message: "User signed in successfully",
            data: {token, user} // Send the token and user data in the response
        });

    }
    catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
}

export const signOut = async (req, res, next) => {
    // Logic for user sign-out
}