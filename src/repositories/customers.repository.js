import dayjs from 'dayjs';
import Customer from '../models/customer.model.js';
import orderRepository from './orders.repository.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';

class CustomerRepository{
    create(customer) {
        return Customer.create(customer);
    }

    transform(customer, transformOptions = {}) {
        console.log(customer);
        if (transformOptions.embed && transformOptions.embed.orders) {
            customer.orders = customer.orders.map(order => {
                order = orderRepository.transform(order, transformOptions);
                return order;
            });
        }

        customer.href = `${process.env.BASE_URL}/customers/${customer._id}`;
        delete customer._id;
        delete customer.__v;

        return customer;
    }

    update(idCustomer, customerModifs){
        const customerToDotNotation = objectToDotNotation(customerModifs);
        return Customer.findByIdAndUpdate(idCustomer, objectToDotNotation(customerModifs), {new:true});
    }

    retrieveAll(retrieveOptions, filter = {}){
        let retrieveQuery;
        let countQuery;

        if(filter.planet){    
            retrieveQuery = Customer.find({'planet':filter.planet}).skip(retrieveOptions.skip).limit(retrieveOptions.limit).sort('birthday');
            countQuery = Customer.countDocuments({'planet':filter.planet});
        }else{

            retrieveQuery = Customer.find().skip(retrieveOptions.skip).limit(retrieveOptions.limit).sort('birthday');
            countQuery = Customer.estimatedDocumentCount(); 
        }
        return Promise.all([retrieveQuery, countQuery]);
    }

    retrieveById(idCustomer, retrieveOptions) {
        const retrieveQuery = Customer.findById(idCustomer);

        if (retrieveOptions.orders) {
            retrieveQuery.populate('orders');
        }
        
        return retrieveQuery;
    }
}

export default new CustomerRepository();