const mongoose = require('mongoose');

const galleryschema = mongoose.Schema({
    myimage:{
        type:String
    },
    caption:{
        type:String
    }

});

module.exports = mongoose.model('photo', galleryschema);