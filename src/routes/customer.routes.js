import express from 'express';
import httpError from 'http-errors';
import httpStatus from 'http-status';
import paginate from 'express-paginate';

import customerRepository from '../repositories/customer.repository.js';
import customerValidator from '../validators/customer.validator.js';
import validator from '../middlewares/validator.js';

const router = express.Router();

class CustomersRoutes{

    constructor() {
        router.post('/', customerValidator.complete(), validator, this.post);
    }

    async post(req, res, next) {
        try {
            const newCustomer = req.body;

            let customerAdded = await customerRepository.create(newCustomer);
            customerAdded = customerAdded.toObject({getters:false, virtuals:false});
            customerAdded = customerRepository.transform(customerAdded);

            res.header('location', customerAdded.href);

            if(req.query._body === 'false') { 
                return res.status(httpStatus.NO_CONTENT).end();
            }
            
            res.status(httpStatus.CREATED).json(customerAdded);
        } catch(err) {
            return next(err);
        }
    }

    
}

new CustomersRoutes();
export default router;