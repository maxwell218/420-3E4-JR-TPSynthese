import dayjs from 'dayjs';
import Order from '../models/order.model.js';
import customersRepository from './customers.repository.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';
import { parse } from 'dotenv-flow';

class OrderRepository{
    retrieveAll(retrieveOptions, filter = {}) {
        let retrieveQuery;
        const countQuery = Order.countDocuments();

        if (filter.topping) {
            retrieveQuery = Order.find({'pizzas.toppings' : { $in : [filter.topping]}}).skip(retrieveOptions.skip).limit(retrieveOptions.limit);
        } else {
            retrieveQuery = Order.find().skip(retrieveOptions.skip).limit(retrieveOptions.limit);
        }

        return Promise.all([retrieveQuery, countQuery]);
    }

    retrieveById(idOrder, retrieveOptions = {}) {
        let retrieveQuery;

        retrieveQuery = Order.findById(idOrder).and((retrieveOptions.pizzeriaId?{'pizzeria' : retrieveOptions.pizzeriaId}:{}));

        if(retrieveOptions.customer) {
            retrieveQuery.populate('customer');
        }
        return retrieveQuery;
    }
    

    transform(order, transformOptions = {}) {
        order.href = `${process.env.BASE_URL}/pizzerias/${order.pizzeria._id}/orders/${order._id}`;
        order.pizzeria = { href: `${process.env.BASE_URL}/pizzerias/${order.pizzeria._id}`};

        if(transformOptions.embed && transformOptions.embed.customer)
        {
            order.customer = customersRepository.transform(order.customer, transformOptions);
        } else {
            order.customer = { href: `${process.env.BASE_URL}/customers/${order.customer._id}` };
        }
        
        order.pizzas.forEach(pizza => {
            delete pizza._id;
            delete pizza.id;
        });

        order.subTotal = 0;
        order.pizzas.forEach(p => {
            order.subTotal += p.price;
        });
        order.subTotal = parseFloat(order.subTotal.toFixed(3));
        
        order.taxeRates = 0.87 / 100;
        order.taxes = parseFloat((order.subTotal*order.taxeRates).toFixed(3));
        order.total = order.subTotal + order.taxes;
        
        delete order._id;
        delete order.id;
        return order;
    }
}

export default new OrderRepository();