import mongoose from 'mongoose';
import { PIZZA_SIZES, PIZZA_TOPPINGS } from '../libs/constants.js';

const orderSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    pizzeria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pizzeria',
        required: true
    },
    orderDate: {type: Date, default: Date.now, required: true},
    pizzas: [{
        toppings: {type: [String], required: true},
        size: {type: String, required: true, enum: PIZZA_SIZES},
        price: {type: Number, required: true, enum: PIZZA_TOPPINGS}
    }]
}, {
    collection:'orders'
});

export default moogoose.model('Order'.orderSchema);