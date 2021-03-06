import express from 'express';
import httpError from 'http-errors';
import httpStatus from 'http-status';
import paginate from 'express-paginate';

import pizzeriaRepository from '../repositories/pizzerias.repository.js';
import ordersRepository from '../repositories/orders.repository.js';
import pizzeriaValidator from '../validators/pizzeria.validator.js';
import validator from '../middlewares/validator.js';
import paginatedResponse from '../libs/paginatedResponse.js';

const router = express.Router();

class PizzeriasRoutes {

    constructor() {
        router.get('/', paginate.middleware(25, 50), this.getAll);
        router.get('/:pizzeriaId', this.getOne);
        router.get('/:pizzeriaId/orders/:orderId', this.getOneOrderFromSpecificPizzeria);
        router.post('/', pizzeriaValidator.complete(), validator, this.post);
    }

    async getOne(req, res, next) {
        const retrieveOptions = {};
        const transformOptions = { embed: {} };

        if (req.query.embed && req.query.embed === 'orders') {
            retrieveOptions.orders = true;
            transformOptions.embed.orders = true;
        }

        try {
            const idPizzeria = req.params.pizzeriaId;
            let pizzeria = await pizzeriaRepository.retrieveById(idPizzeria, retrieveOptions);

            if (!pizzeria) {
                return next(httpError.NotFound());
            }
            pizzeria = pizzeria.toObject({ getters: false, virtuals: true });
            pizzeria = pizzeriaRepository.transform(pizzeria, transformOptions);


            res.status(httpStatus.OK).json(pizzeria);

        } catch (err) {
            return next(err);
        }
    }

    async getAll(req, res, next) {

        try {
            const retrieveOptions = {
                skip: req.skip,
                limit: req.query.limit
            };

            const filter = {};
            if (req.query.speciality) {
                filter.speciality = req.query.speciality;
            }

            let [pizzerias, documentsCount] = await pizzeriaRepository.retrieveAll(retrieveOptions, filter);

            pizzerias = pizzerias.map(p => {
                p = p.toObject({ getters: false, virtuals: false });
                p = pizzeriaRepository.transform(p);
                return p;
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
            }

            const response = paginatedResponse(pizzerias, pagination );
            
            res.status(httpStatus.OK).json(response);
        } catch (err) {
            return next(err);
        }
    }

    async post(req, res, next) {
        const newPizzeria = req.body;

        if (Object.keys(newPizzeria).length === 0) {
            return next(httpError.BadRequest('La pizzeria ne peut pas contenir aucune donn??e.'));
        }

        try {
            let pizzeria = await pizzeriaRepository.create(newPizzeria);

            pizzeria = pizzeria.toObject({getters:false, virtuals:false});
            pizzeria = pizzeriaRepository.transform(pizzeria);
            res.header('location', pizzeria.href);

            if (req.query._body === 'false') {
                return res.status(httpStatus.CREATED).end();
            }

            res.status(httpStatus.CREATED).json(pizzeria);

        } catch(err) {
            return next(err);
        }
    }

    async getOneOrderFromSpecificPizzeria(req, res, next) {
        try {
            const retrieveOptions = {};
            retrieveOptions.pizzeriaId = req.params.pizzeriaId;
            const transformOptions = { embed:{}};

            if(req.query.embed && req.query.embed === 'customer') {
                retrieveOptions.customer = true;
                transformOptions.embed.customer = true;
            }

            let order = await ordersRepository.retrieveById(req.params.orderId, retrieveOptions);

            if(!order) {
                return next(httpError.NotFound('La pizzeria ou la commande sp??cifique n???existe pas'));
            }

            order = order.toObject({getters:false, virtuals: true});
            order = ordersRepository.transform(order, transformOptions);

            res.status(httpStatus.OK).json(order);
        } catch(err)
        {
            return next(err);
        }
    }
}

new PizzeriasRoutes();
export default router;