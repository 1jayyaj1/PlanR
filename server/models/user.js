let mongoose = require('mongoose')
    Schema = mongoose.Schema;

let userSchema = Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('User', userSchema)