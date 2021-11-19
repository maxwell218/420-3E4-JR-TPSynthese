import express from 'express';
import httpError from 'http-errors';
import httpStatus from 'http-status';
import paginate from 'express-paginate';

import customerRepository from '../repositories/customer.repository.js';
import customerValidator from '../validators/customer.validator.js';
import validator from '../middlewares/validator.js';

const router = express.Router();

class CustomersRoutes {

    constructor() {
        router.post('/', customerValidator.complete(), validator, this.post);
        router.put('/:idCustomer', customerValidator.complete() , validator ,this.put);
        router.get('/', this.getAll);
        router.get('/:idCustomer', this.getOne);

    }

    async getAll(req, res, next){


    }

    async post(req, res, next) {
        try {
            const newCustomer = req.body;

            let customerAdded = await customerRepository.create(newCustomer);
            customerAdded = customerAdded.toObject({ getters: false, virtuals: false });
            customerAdded = customerRepository.transform(customerAdded);

            res.header('location', customerAdded.href);

            if (req.query._body === 'false') {
                return res.status(httpStatus.NO_CONTENT).end();
            }

            res.status(httpStatus.CREATED).json(customerAdded);
        } catch (err) {
            return next(err);
        }
    }

    async put(req, res, next) {
        try {
            let customer = await customerRepository.update(req.params.idCustomer, req.body);

            if (!customer) {
                return next(httpError.NotFound(`Le customer avec l'id: ${req.params.idCustomer} n'existe pas.`))
            }

            if (req.query._body && req.query._body == 'false') {
                return res.status(httpStatus.NO_CONTENT).end();
            } else {

                customer = customer.toObject({ getters: false, virutals: false });
                customer = customerRepository.transform(customer);

                return res.status(httpStatus.CREATED).json(customer)
            }
        } catch (err) {

            return next(err);
        }
    }

    async getOne(req, res, next) {

    }

}

new CustomersRoutes();
export default router;