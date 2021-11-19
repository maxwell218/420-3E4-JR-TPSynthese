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
            const hasNextPage = (paginate.hasNextPages(req))(totalPages);
            const pageArray = paginate.getArrayPages(req)(3, totalPages, req.query.page);

            const response = {
                _metadata: {
                    hasNextPage,
                    page: req.query.page,
                    limit: req.query.limit,
                    skip: req.skip,
                    totalPages,
                    totalDocuments: documentsCount
                },
                _links: {
                    prev: pageArray[0].url,
                    self: pageArray[1].url,
                    next: pageArray[2].url
                },
                data: orders
            };

            if (req.query.page === 1) {
                delete response._links.prev;
                response._links.self = pageArray[0].url;
                response._links.next = pageArray[1].url;
            }

            if (!hasNextPage) {
                response._links.prev = pageArray[1].url;
                response._links.self = pageArray[2].url;
                delete response._links.next;
            }
            
            res.status(httpStatus.OK).json(response);
        } catch (err) {
            return next(err);
        }
    }

}

new OrdersRoutes();
export default router;