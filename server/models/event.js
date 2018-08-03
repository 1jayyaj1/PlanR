let mongoose = require('mongoose')
    Schema = mongoose.Schema;
    
let eventSchema = Schema({
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
        required: false
    },
    recurrence: {
        type: String,
        required: false
    },
    daysSelected: {
        type: Array,
        required: false
    },
    activationDay: {
        type: Date,
        required: false
    },
    calendarInfo: {
        title: {
            type: String,
            required: true
        },
        allDay: false,
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    }
})

module.exports = mongoose.model('Event', eventSchema)
