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
        router.post('/',);
    }
}

new CustomersRoutes();
export default router;