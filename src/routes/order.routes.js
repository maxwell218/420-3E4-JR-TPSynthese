import express from 'express';
import httpError from 'http-errors';
import httpStatus from 'http-status';
import paginate from 'express-paginate';

import orderRepository from '../repositories/order.repository.js';

const router = express.Router();

class OrdersRoutes{

    constructor() {
        router.get('/', paginate.middleware(10, 30), this.getAll)
    }

    async getAll(req, res, next) {

        const retrieveOptions = {
            page:req.page,
            limit:req.limit,
            topping:req.topping,
        }

        try {
            let [orders, documentsCount] = await orderRepository.retrieveAll(retrieveOptions);
            
            orders = orders.map(o => {
                o = o.toObject({getters:false, virtuals:false});
                o = orderRepository.transform(o);
                return o;
            });

        } catch (err) {
            return next(err);
        }
    }

}

new OrdersRoutes();
export default router;