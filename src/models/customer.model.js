import mongoose from 'mongoose';
import {PLANET_NAMES} from '../libs/constants.js';

const customerSchema = mongoose.Schema({
    name:{type: String, required:true},
    email:{type: String, unique:true, required:true},
    planet:{type:String, enum:PLANET_NAMES},
    coord:{
        lat:{type:Number, min:-1000, max:1000, required:true},
        lon:{type:Number, min:-1000, max:1000, required:true}
    },
    phone:{type:String, required:true},
    birthday:{type:Date,required:true},
    referalCode:{type:String}
},{
    collection:'customers',
    strict:'throw'
});

customerSchema.virtual('orders', {
    ref: 'Order',
    foreignField:'customer',
    localField:'_id',
    justOne:false
});

export default mongoose.model('Customer', customerSchema);