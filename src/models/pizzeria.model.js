import mongoose from 'mongoose';
import {PLANETS_NAMES, MONSTER_ANCESTORS, PIZZA_TOPPINGS} from '../libs/constants.js';

const pizzeriaSchema = mongoose.Schema({

    planet: { type: String, required: true, enum:PLANETS_NAMES },
    coord: {
        lon: { type: Number, min: -1000, max: 1000, required: true },
        lat: { type: Number, min:-1000, max:1000 ,required: true }
    },
    chef: {
        name: { type: String, required: true },
        ancestor: { type: String, required: true, enum:MONSTER_ANCESTORS},
        speciality: { type: String, required: true, enum:PIZZA_TOPPINGS}
    }
},{
    collection:'pizzerias',
    strict:'throw'
});

export default monsgoose.model('Pizzeria', pizzeriaSchema);
