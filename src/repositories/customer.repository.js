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

    update(idCustomer, customerModifs){
        const customerToDotNotation = objectToDotNotation(customerModifs);
        return Customer.findByIdAndUpdate(idCustomer, objectToDotNotation(customerModifs), {new:true});
    }
    retrieveAll(retrieveOptions, filter = {}){

    }
}

export default new CustomerRepository();