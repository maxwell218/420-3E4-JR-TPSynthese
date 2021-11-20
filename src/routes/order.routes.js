import express from 'express';
import httpError from 'http-errors';
import httpStatus from 'http-status';
import paginate from 'express-paginate';

import orderRepository from '../repositories/order.repository.js';
import paginatedResponse from '../libs/paginatedResponse.js';

const router = express.Router();

class OrdersRoutes{

    constructor() {
        router.get('/', paginate.middleware(10, 30), this.getAll)
    }

    async getAll(req, res, next) {

        const retrieveOptions = {
            skip:req.skip,
            limit:req.query.limit,
            topping:req.topping,
        }

        const filter = {};
        if (req.query.topping) {
            filter.topping = req.query.topping;
        }

        try {
            let [orders, documentsCount] = await orderRepository.retrieveAll(retrieveOptions, filter);
            
            orders = orders.map(o => {
                o = o.toObject({getters:false, virtuals:false});
                o = orderRepository.transform(o);
                return o;
            });

            const totalPages = Math.ceil(documentsCount/req.query.limit);

            const pagination = {
                totalPages,
                hasNextPage: (paginate.hasNextPages(req))(totalPages),
                pageArray: paginate.getArrayPages(req)(3, totalPages, req.query.page),
                page: req.query.page,
                limit: req.query.limit,
                skip: req.skip,
                totalDocuments: documentsCount
            }
            
            const response = paginatedResponse(orders, pagination);
            
            res.status(httpStatus.OK).json(response);
        } catch (err) {
            return next(err);
        }
    }

    async getOneOrderFromOnePizzeria(req, res, next) {
        try {

            //let order = await 
            
            //if(!)
            res.status(httpStatus.OK).json(response);
        } catch(err)
        {
            return next(err);
        }
    }
}

new OrdersRoutes();
export default router;