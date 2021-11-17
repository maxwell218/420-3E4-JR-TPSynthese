import mongoose from 'mongoose';
import constants from '../libs/constants.js';

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
        size: {type: String,}
    }]
}, {
    collection:'orders'
});