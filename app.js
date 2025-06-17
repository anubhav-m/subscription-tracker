import express from 'express';
import { PORT, NODE_ENV } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use(arcjetMiddleware); // Arcjet middleware for security and rate limiting

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(errorMiddleware); // Error handling middleware should be the last middleware

app.get('/', (req,res)=>{
    res.send("Welcome to subscription tracker API!");
})

app.listen(PORT, async()=>{
    try{
        console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
        await connectToDatabase();
    }
    catch (error) {
        console.error(`Error starting the server: ${error.message}`);
        process.exit(1); 
    }
})


export default app;