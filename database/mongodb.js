import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

if(!DB_URI) {
    throw new Error('Database URI is not defined in environment variables');
}

const connectToDatabase = async () => {
    try{
        await mongoose.connect(DB_URI); 
        console.log(`Connected to MongoDB successfully in ${NODE_ENV} mode`);
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); 
    }
}

export default connectToDatabase;