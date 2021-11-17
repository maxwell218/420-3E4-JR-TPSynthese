import express from 'express';
import httpError from 'http-errors';
import httpStatus from 'http-status';
import paginate from 'express-paginate';

import pizzeriaRepository from '../repositories/pizzeria.repository.js';
import pizzeriaValidator from '../validators/pizzeria.validator.js';
import validator from '../middlewares/validator.js';

const router = express.Router();

class PizzeriasRoutes {

    constructor() {
        router.get('/', paginate.middleware(25, 50), this.getAll);
        router.get('/:pizzeriaId', this.getOne);
    }

    async getOne(req, res, next) {
        const retrieveOptions={};
        const transformOptions = { embed:{}};

        if(req.query.embed && req.query.embed === 'orders'){
            retrieveOptions.orders = true;
            transformOptions.embed.orders = true;
        }

        try {
            const idPizzeria = req.params.pizzeriaId;
            let pizzeria = await pizzeriaRepository.retrieveById(idPizzeria,retrieveOptions);

            if(!pizzeria){
                return next(httpError.NotFound());
            }
            pizzeria = pizzeria.toObject({getters:false, virtuals:true});
            pizzeria = pizzeriaRepository.transform(pizzeria, transformOptions);

            res.status(httpStatus.OK).json(pizzeria);

        } catch (err) {
            return next(err);
        }
    }

    async getAll(req, res, next) {
        //TODO: changer l'affichage, valider les chefs etc, SB
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
            const hasNextPage = (paginate.hasNextPages(req))(totalPages);
            const pageArray = paginate.getArrayPages(req)(3, totalPages, req.query.page);

            if(filter.speciality)
            {
                console.log("TESSSTTT");
            }

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
                data: pizzerias
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

new PizzeriasRoutes();
export default router;