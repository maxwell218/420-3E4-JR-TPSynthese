import express from 'express';
import httpError from 'http-errors';
import httpStatus from 'http-status';

import orderRepository from '../repositories/order.repository.js';
import orderValidator from '../validators/order.validator.js';
import validator from '../middlewares/validator.js';

const router = express.Router();

class OrdersRoutes{

    constructor() {
        
    }

}

new OrdersRoutes();
export default router;