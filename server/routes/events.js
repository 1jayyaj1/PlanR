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
          return res.send(docs)
        })
        .catch(err => {
            console.log(err);
            return res.sendStatus(500)
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
        return res.sendStatus(500);
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
                return res.sendStatus(200);
            })
            .catch(err => {
                if (err.code == 11000) {
                    return res.status(404).send("Event not found with id " + id);
                }
                return res.status(500).send("Unable to delete event with id " + id);
            })
    } catch {
        return res.sendStatus(500);
    }
});

router.put('/:eventId', function(req, res, next) {
    const body = req.body;
    const id = req.params.eventId;
    var updateField = {};
    updateField.calendarInfo = {};
    var activationDay = new Date(body.activationDay);
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

        if (body.activationDay != null) { 
            updateField.activationDay = activationDay;
        }

        if (body.location != null) {
            if (/^[0-9a-zA-Z- ]+$/.test(body.location)) {
                updateField.location = body.location;
            } else {
                return res.sendStatus(400);
            }
        }

        if (body.isRecurrent === true) {
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

        Event.findByIdAndUpdate(id, updateField.calendarInfo, {new: true})
        .then(event => {
            if (!event) {
                return res.status(404).send("Event not found with id " + id);
            }
            return res.send(event);
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
        var filtered = 
            body.filter(e => {
                var startDate = new Date(e.calendarInfo.start);
                var endDate = new Date(e.calendarInfo.end);
                var activationDay = new Date(e.activationDay);
                var capacity = Number(e.capacity);

                if (!/^[a-zA-Z- ]+$/.test(e.calendarInfo.title)) {
                    return false;
                }
        
                if (startDate >= endDate) {
                    return false;
                }
        
                if (!/^[0-9a-zA-Z- ]+$/.test(e.location)) {
                    return false;
                }
            
                return true;
            });

        
        if (body.length == filtered.length) {
            var events = new Event(filtered);

            events.save()
            .then(event => {
                console.log('Created event(s) ' + event._id);
                return res.sendStatus(200);
            })
            .catch(err => {
                console.error(err);
                if (err.code === 11000) {
                    return res.status(500).send("Event(s) already exists in the database");
                }
                return res.status(500).send("Unable to create event(s) in database");
            })

        } else {
            return res.sendStatus(400);
        }
    } catch {
        return res.sendStatus(400);
    }
});

  module.exports = router;
