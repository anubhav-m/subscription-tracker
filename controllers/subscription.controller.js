import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js"

//req.user._id -> object -> ObjectId("60c72b2f9b1d8c001c8e4a2f")
//req.user.id -> string of _id -> "60c72b2f9b1d8c001c8e4a2f"

export const createSubscription = async (req, res, next) => {
    try{
        const subscription = await Subscription.create({...req.body, user: req.user._id}); // Create a new subscription with the data from the request body and associate it with the user ID from the request
        
        res.status(201).json({
            sucess: true,
            data: subscription
        })
    }
    catch(error){
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find( {user:req.user._id} );

        if (!subscriptions || subscriptions.length === 0) {
            const error = new Error("No subscriptions for this user");
            error.statusCode = 404; //Not Found
            throw error;
        }

        res.status(200).json({
            success: true,
            data: subscriptions
        })
    }

    catch(error){
        next(error);
    }
}