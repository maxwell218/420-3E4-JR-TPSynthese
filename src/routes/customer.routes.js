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
        router.put('/:idCustomer', customerValidator.complete(), validator, this.put);
        router.get('/', this.getAll);
        router.get('/:idCustomer', this.getOne);

    }

    async getAll(req, res, next) {
        try {
            const retrieveOptions = {
                skip: req.skip,
                limit: req.query.limit
            };
            
            let [customers, documentsCount] = await customerRepository.retrieveAll(retrieveOptions);
            customers = customers.map(c => {
                c = c.toObject({ getters: false, virtuals: false });
                c = customerRepository.transform(c);
                return c;
            });

            const totalPages = Math.ceil(documentsCount / req.query.limit);
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
                    prev: (totalPages > 2 ? pageArray[0].url : undefined),
                    self: (totalPages > 2 ? pageArray[1].url : pageArray[0].url),
                    next: (totalPages > 2 ? pageArray[2].url : undefined)
                },
                data: customers
            };

            if (totalPages > 1) {
                if (req.query.page === 1) {
                    delete response._links.prev;
                    response._links.self = pageArray[0].url;
                    response._links.next = pageArray[1].url;
                }

                if (!hasNextPage) {
                    response._links.prev = (totalPages > 2 ? pageArray[1].url : pageArray[0].url);
                    response._links.self = (totalPages > 2 ? pageArray[2].url : pageArray[1].url);
                    delete response._links.next;
                }
            }
            else {
                delete response._links.prev;
                delete response._links.next;
            }
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

    }

}

new CustomersRoutes();
export default router;