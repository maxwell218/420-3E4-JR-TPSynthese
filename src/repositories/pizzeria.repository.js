import dayjs from 'dayjs';
import Pizzeria from '../models/pizzeria.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';

class PizzeriaRepository{
    retrieveAll(retrieveOptions, filter = {}) {
        const retrieveQuery = Pizzeria.find(filter).skip(retrieveOptions.skip).limit(retrieveOptions.limit);
        const countQuery = Pizzeria.countDocuments();

        return Promise.all([retrieveQuery, countQuery]);
    }

    transform(pizzeria, transformOptions = {}) {

        return pizzeria;
    }
}

export default new PizzeriaRepository();