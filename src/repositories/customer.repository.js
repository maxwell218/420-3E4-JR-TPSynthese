import dayjs from 'dayjs';
import Customer from '../models/customer.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';

class CustomerRepository{
    create(customer) {
        return Customer.create(customer);
    }

    transform(customer, transformOptions = {}) {

        return customer;
    }
}

export default new CustomerRepository();