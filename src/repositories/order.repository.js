import dayjs from 'dayjs';
import Order from '../models/order.model.js';
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

    transform(order, transformOptions = {}) {
        order.customer = { href: `${process.env.BASE_URL}/customers/${order.customer._id}` };
        order.pizzeria = { href: `${process.env.BASE_URL}/pizzerias/${order.pizzeria._id}`};
        order.href = `${process.env.BASE_URL}/pizzerias/${order._id}`;
        delete order._id;

        order.subTotal = 0;
        order.pizzas.forEach(p => {
            order.subTotal += p.price;
        });
        order.subTotal = parseFloat(order.subTotal.toFixed(3));

        order.taxeRates = 0.87 / 100;
        order.taxes = parseFloat((order.subTotal*order.taxeRates).toFixed(3));
        order.total = order.subTotal + order.taxes;

        return order;
    }
}

export default new OrderRepository();