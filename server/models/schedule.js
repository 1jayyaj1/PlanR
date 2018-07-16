let mongoose = require('mongoose');

let schedulesSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    date:{
        type: String,
        required: true
    }
});

let Article = module.exports = mongoose.model('Schedule', schedulesSchema)