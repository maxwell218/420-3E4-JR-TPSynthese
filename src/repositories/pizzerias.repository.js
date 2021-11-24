import dayjs from 'dayjs';
import Pizzeria from '../models/pizzeria.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';

class PizzeriaRepository{
    retrieveAll(retrieveOptions, filter = {}) {

        let retrieveQuery;
        let countQuery;

        if(filter.speciality)
        {
            retrieveQuery = Pizzeria.find({'chef.speciality':filter.speciality}).skip(retrieveOptions.skip).limit(retrieveOptions.limit);
            countQuery = Pizzeria.countDocuments({'chef.speciality':filter.speciality});
        }
        else
        {
            retrieveQuery = Pizzeria.find().skip(retrieveOptions.skip).limit(retrieveOptions.limit);
            countQuery = Pizzeria.countDocuments();
        }
        

        return Promise.all([retrieveQuery, countQuery]);
    }

    retrieveById(idPizzeria, retrieveOptions){
        const retrieveQuery = Pizzeria.findById(idPizzeria);

        if(retrieveOptions.orders){
            retrieveQuery.populate('orders');
        }
        return retrieveQuery;
    }

    create(pizzeria) {
        return Pizzeria.create(pizzeria);
    }

    transform(pizzeria, transformOptions = {}) {

        pizzeria.href = `/pizzerias/${pizzeria._id}`;
        delete pizzeria._id;
        delete pizzeria.__v;

        pizzeria.lightspeed = `[${pizzeria.planet}]@(${pizzeria.coord.lat};${pizzeria.coord.lon})`;
        
        return pizzeria;
    }
}

export default new PizzeriaRepository();