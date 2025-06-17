import { Router } from 'express';
import { getAllUsers, getUserById, getUser } from '../controllers/user.controller.js';
import { authorize } from '../middlewares/auth.middleware.js';

//get all users -> admin
//get user by id -> admin
//get user -> member

const userRouter = Router();

userRouter.get('/', authorize, getAllUsers);

userRouter.get('/user', authorize, getUser);

userRouter.get('/:id', authorize, getUserById);

userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));

userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user by id' }));

userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user by id' }));

export default userRouter;