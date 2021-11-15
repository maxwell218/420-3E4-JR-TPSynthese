import mongoose from 'mongoose';
import PLANET_NAMES from '../libs/constants.js';

const customerSchema = mongoose.Schema({
    name:{type: String, required:true},
    email:{type: String, unique:true, required:true},
    planet:{type:String, enum:PLANET_NAMES},    //TODO: Valider que enum est bien appelé (probablement pas)
    coord:{
        lat:{type:Number, min:-1000, max:1000, required:true},
        lon:{type:Number, min:-1000, max:1000, required:true}
    },
    phone:{type:String, required:true}, //TODO: Valider si type hexa existe
    birthday:{type:Date,required:true}, //TODO: Valider si doit être à now par défaut
    referalCode:{type:String}
},{
    collection:'customers',
    strict:'throw'
});

export default mongoose.model('Customers', customerSchema);