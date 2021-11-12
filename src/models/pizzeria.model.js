import mongoose from 'mongoose';

const pizzeriaSchema = mongoose.Schema({

    planet: {type:String, required: true},
    coord: {
        lon: { type: Number, required: true },
        lat: { type: Number, required: true }
    },
    chef:{
        name: {type:String},
        ancestor: {type:String},
        speciality: {type:String}
    }
});

export default monsgoose.model('Pizzeria', pizzeriaSchema);
