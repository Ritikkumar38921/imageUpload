const mongoose = require('mongoose');

let schema = mongoose.Schema({
    filename:{
        type:String,
        required:true,
    }
});

let images = new mongoose.model('images',schema);
module.exports = images;