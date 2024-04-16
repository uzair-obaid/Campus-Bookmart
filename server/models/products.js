const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    
    img:{
        data:Buffer,
        name:String,
        size: Number

    },
    name: {
        type: String,
        required: true
    },
    type:{
        type:String,
        required:true
    },
    subtype:{
        type:String,
        required:true
    },
    availability: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        required: true
    }
});

productSchema.index({name:1,type:1,subtype:1},{unique:true});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
