import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getUserSubscriptions);

subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'GET subscription by id' }));

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'CREATE new subscription by id' }));

subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE subscription by id' }));

subscriptionRouter.get('/user/:id', (req, res) => res.send({ title: 'GET all subscriptions of user by id' }));

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: 'CANCEL all subscription by id' }));

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'GET upcoming renewals' }));



export default subscriptionRouter;