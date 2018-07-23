let mongoose = require('mongoose')
    Schema = mongoose.Schema;
    
let eventSchema = Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    isRecurrent: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    allDay: {
        type: Boolean,
        required: true
    },
    recurrenceType: {
        type: String,
        required: true
    },
    daysSelected: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Event', eventSchema)
