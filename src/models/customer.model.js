import mongoose from 'mongoose';

{ "_id": { "$oid": "5fc125a21633312494c41fee" }, 
"name": "Ambra Thibodeau", 
"planet": "Ninia", 
"coord": { "lat": "-94.709", "lon": "235.214" }, 
"referalCode": "wohGhiRe2ah", "email": "AmbraThibodeau@dayrep.com", "phone": "99DED6D8CAFF381E", "birthday": "1951-06-14" },


const customerSchema = mongoose.Schema({
    name:{type: String, required:true},
    email:{type: String, unique:true, required:true},
    planet:{type:}
},{

});