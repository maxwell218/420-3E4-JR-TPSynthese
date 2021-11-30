import express from 'express';
import httpError from 'http-errors';
import httpStatus from 'http-status';
import paginate from 'express-paginate';

import customerRepository from '../repositories/customers.repository.js';
import customerValidator from '../validators/customer.validator.js';
import validator from '../middlewares/validator.js';

import paginatedResponse from '../libs/paginatedResponse.js';

const router = express.Router();

class CustomersRoutes {

    constructor() {
        router.post('/', customerValidator.complete(), validator, this.post);
        router.put('/:idCustomer', customerValidator.complete(), validator, this.put);
        router.get('/', paginate.middleware(20, 40), this.getAll);
        router.get('/:idCustomer', this.getOne);
    }

    async getAll(req, res, next) {
        try {
            const retrieveOptions = {
                skip: req.skip,
                limit: req.query.limit
            };
            const filter = {};
            if (req.query.planet) {
                filter.planet = req.query.planet;
            }

            let [customers, documentsCount] = await customerRepository.retrieveAll(retrieveOptions, filter);
            customers = customers.map(c => {
                c = c.toObject({ getters: false, virtuals: false });
                c = customerRepository.transform(c);
                return c;
            });

            const totalPages = Math.ceil(documentsCount / req.query.limit);
            const pagination = {
                totalPages,
                hasNextPage: (paginate.hasNextPages(req))(totalPages),
                pageArray: paginate.getArrayPages(req)(3, totalPages, req.query.page),
                page: req.query.page,
                limit: req.query.limit,
                skip: req.skip,
                totalDocuments: documentsCount
            };

            const response = paginatedResponse(customers, pagination);

            res.status(httpStatus.OK).json(response);

        } catch (err) {

            return next(err);
        }

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
        const retrieveOptions = {};
        const transformOptions = {};

        if (req.query.embed && req.query.embed === 'orders') {
            retrieveOptions.orders = true;
            transformOptions.embed = {};
            transformOptions.embed.orders = true;
        }

        try {
            const idCustomer = req.params.idCustomer;
            let customer = await customerRepository.retrieveById(idCustomer, retrieveOptions);

            if (!customer) {
                return next(httpError.NotFound());
            }

            customer = customer.toObject({ getters: false, virtuals: true });
            customer = customerRepository.transform(customer, transformOptions);

            res.status(httpStatus.OK).json(customer);
        } catch (err) {
            return next(err);
        }
    }

}

new CustomersRoutes();
export default router;