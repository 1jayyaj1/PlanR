var express = require('express');
var router = express.Router();
let Event =  require('../models/event');

let types = ["Weekly", "Biweekly", "Triweekly", "Monthly"];
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

// for debugging only. will be removed in the future for security reasons
router.get('/', function(req, res, next) {
    Event.find()
        .sort()
        .exec()
        .then(docs => {
          res.send(docs)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500)
        })
});

router.get('/:eventId', function(req, res, next) {
    try {
        Event.find({"_id" : req.params.eventId})
            .exec()
            .then(events => {
            if (events.length == 0) {
                return res.sendStatus(404);
            } else {
                return res.send(events[0])
            }
            })
            .catch(err => {
            console.log(err);
            return res.sendStatus(404);
            })
    } catch {
        res.sendStatus(500);
    }
});

router.delete('/:eventId', function(req, res, next) {
    const id = req.params.eventId;
    try {
        Event.findByIdAndRemove(id)
            .then(event => {
                if (!event) {
                    return res.status(404).send("Event not found with id " + id);
                }
                res.sendStatus(200);
            })
            .catch(err => {
                if (err.code == 11000) {
                    return res.status(404).send("Event not found with id " + id);
                }
                return res.status(500).send("Unable to delete event with id " + id);
            })
    } catch {
        res.sendStatus(500);
    }
});

router.put('/:eventId', function(req, res, next) {
    const body = req.body;
    const id = req.params.eventId;
    var updateField = {};
    updateField.calendarInfo = {};
    try {
        if (body.calendarInfo != null) {
            if (/^[a-zA-Z- ]+$/.test(body.calendarInfo.title)) {
                updateField.calendarInfo.title = body.calendarInfo.title;
            } else {
                return res.sendStatus(400);
            }
            var startDate = new Date(body.calendarInfo.start);
            var endDate = new Date(body.calendarInfo.end);
            if (startDate <= endDate) {
                updateField.calendarInfo.start = startDate;
                updateField.calendarInfo.end = endDate;
            } else {
                return res.sendStatus(400);
            }
        }

        if (body.capacity != null) { 
            updateField.capacity = Number(body.capacity);
        }

        if (body.location != null) {
            if (/^[0-9a-zA-Z- ]+$/.test(body.location)) {
                updateField.location = body.location;
            } else {
                return res.sendStatus(400);
            }
        }

        if (isRecurrent) {
            if (body.isRecurrent != null) { 
                updateField.isRecurrent = Boolean(body.isRecurrent);
            }
    
            if (body.recurrence != null) { 
                if (types.includes(body.recurrence)) {
                    updateField.recurrence = body.recurrence;
                } else {
                    return res.sendStatus(400);
                }
            }
        } else {
            if (body.allDay != null) { 
                updateField.allDay = Boolean(body.allDay);
            }
        }

        if (body.daysSelected != null) { 
            if (body.daysSelected.every(x => days.includes(x))) {
                updateField.daysSelected = body.daysSelected;
            } else {
                return res.sendStatus(400);
            }
        }

        Event.findByIdAndUpdate(id, updateField, {new: true})
        .then(event => {
            if (!event) {
                return res.status(404).send("Event not found with id " + id);
            }
            res.send(event);
        })
        .catch(err => {
            console.log(err);
            if (err.code === 11000) {
                return res.status(404).send("Event not found with id " + id);
            }
            return res.sendStatus(500);
        })
    } catch {
        return res.sendStatus(500);
    }
});

router.post('/', function(req, res, next) {
    const body = req.body;
    try {
        var startDate = new Date(body.calendarInfo.start);
        var endDate = new Date(body.calendarInfo.end);
        var capacity = Number(body.capacity);
        var isRecurrent = Boolean(body.isRecurrent);
        var allDay = Boolean(body.allDay);
        var error = false;
        if (!/^[a-zA-Z- ]+$/.test(body.calendarInfo.title)) {
            error = true;
        }

        if (startDate >= endDate) {
            error = true;
        }

        if (!/^[0-9a-zA-Z- ]+$/.test(body.location)) {
            error = true;
        }

        if (isRecurrent) {
            if (!types.includes(body.recurrence)) {
                error = true;
            }
    
            if (!body.daysSelected.every(x => days.includes(x))) {
                error = true;
            }
        }

        if (!error) {
            var event;
            if (isRecurrent) {
                event = new Event({
                    capacity: capacity,
                    location: body.location,
                    isRecurrent: isRecurrent,
                    description: body.description,
                    allDay: allDay,
                    recurrence: body.recurrence,
                    daysSelected: body.daysSelected,
                    calendarInfo: {
                        title: body.calendarInfo.title,
                        allDay: false,
                        start: startDate,
                        end: endDate
                    }
                });
            } else {
                event = new Event({
                    capacity: capacity,
                    location: body.location,
                    isRecurrent: isRecurrent,
                    description: body.description,
                    calendarInfo: {
                        title: body.calendarInfo.title,
                        allDay: false,
                        start: startDate,
                        end: endDate
                    }
                });
            }

            event.save()
                .then(event => {
                    console.log('Created event ' + event._id);
                    res.sendStatus(200)
                })
                .catch(err => {
                    console.error(err);
                    if (err.code === 11000) {
                        return res.status(500).send("This event already exists in the database");
                    }
                    res.status(500).send("Unable to create event in database")
                })
        } else {
            return res.sendStatus(400);
        }
    } catch {
        res.sendStatus(400)
    }
});

  module.exports = router;