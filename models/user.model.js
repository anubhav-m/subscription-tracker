import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type: String, 
        required: [true, 'User name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50
    },

    email : {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },

    password : {
        type: String,
        required: [true, 'Password is required'],
        minLength: 6,
    },

    role : {
        type: String,
        enum: ['admin', 'member']
    }
}, {timestamps:true} );

//Middleware to set role if not given
userSchema.pre('save', function(next) {
    if(!this.role){
        this.role = "member";
    }
    next();
});

const User = mongoose.model('User', userSchema); 

export default User;