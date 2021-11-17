import dayjs from 'dayjs';
import Order from '../models/order.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';

class OrderRepository{
    retrieveAll(retrieveOptions) {
        const retrieveQuery = Order.find().skip(retrieveOptions.skip).limit(retrieveOptions.limit);
        const countQuery = Order.countDocuments();

        return Promise.all([retrieveQuery, countQuery]);
    }

    transform(order, transformOptions = {}) {
        order.href = `${process.env.BASE_URL}/pizzerias/${order._id}`;
        delete order._id;

        order.subTotal = 0;
        order.pizzas.forEach(p => {
            order.subTotal += p.price;
        });
        order.subTotal = parseFloat(order.subTotal.toFixed(3));

        return order;
    }
}

export default new OrderRepository();