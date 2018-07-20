let mongoose = require('mongoose')
    Schema = mongoose.Schema;
    
let eventSchema = Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    }
})

module.exports = mongoose.model('Event', eventSchema)
