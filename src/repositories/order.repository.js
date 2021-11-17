import dayjs from 'dayjs';
import Order from '../models/order.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';

class OrderRepository{
    retrieveAll(retrieveOptions) {
        const retrieveQuery = Order.find().skip(retrieveOptions.page).limit(retrieveOptions.limit);
        const countQuery = Order.countDocuments();

        return Promise.all([retrieveQuery, countQuery]);
    }

    transform(order, transformOptions = {}) {
        order.href = `${process.env.BASE_URL}/pizzerias/${order._id}`;
        delete order._id;
        return order;
    }
}

export default new OrderRepository();