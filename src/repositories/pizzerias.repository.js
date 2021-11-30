import dayjs from 'dayjs';
import Pizzeria from '../models/pizzeria.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';
import orderRepository from './orders.repository.js';

class PizzeriaRepository{
    retrieveAll(retrieveOptions, filter = {}) {

        let retrieveQuery;
        let countQuery;

        if(filter.speciality)
        {
            retrieveQuery = Pizzeria.find({'chef.speciality':filter.speciality}).skip(retrieveOptions.skip).limit(retrieveOptions.limit).sort('chef.name');
            countQuery = Pizzeria.countDocuments({'chef.speciality':filter.speciality});
        }
        else
        {
            retrieveQuery = Pizzeria.find().skip(retrieveOptions.skip).limit(retrieveOptions.limit).sort('chef.name');
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

        if(transformOptions.embed && transformOptions.embed.orders){
            pizzeria.orders = pizzeria.orders.map(o =>{
                o = orderRepository.transform(o, transformOptions);
                return o;
            });
        }
        
        return pizzeria;
    }
}

export default new PizzeriaRepository();