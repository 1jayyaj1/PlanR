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
        .except(err => {
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
            .except(err => {
                if (err.code == 11000) {
                    return res.status(404).send("Event not found with id " + id);
                }
                return res.status(500).send("Unable to delete event with id " + id);
            })
    } catch {
        res.sendStatus(500);
    }
});

router.post('/', function(req, res, next) {
    const body = req.body;
    try {
        var startDate = new Date(body.startDate);
        var endDate = new Date(body.endDate);
        var capacity = Number(body.capacity);
        var isRecurrent = Boolean(body.isRecurrent);
        var allDay = Boolean(body.allDay);
        var error = false;
        if (!/^[a-zA-Z- ]+$/.test(body.name)) {
            error = true;
        }

        if (startDate >= endDate) {
            error = true;
        }

        if (!/^[0-9a-zA-Z- ]+$/.test(body.location)) {
            error = true;
        }

        if (!types.includes(body.recurrenceType)) {
            error = true;
        }

        if (!body.daysSelected.every(x => days.includes(x))) {
            error = true;
        }

        if (!error) {
            var event = new Event({
                name: body.name,
                startDate: startDate,
                endDate: endDate,
                capacity: capacity,
                location: body.location,
                isRecurrent: isRecurrent,
                description: body.description,
                allDay: allDay,
                recurrenceType: body.recurrenceType,
                daysSelected: body.daysSelected
            });

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