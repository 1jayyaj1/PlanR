var express = require('express');
var router = express.Router();
let Event =  require('../models/event');

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

router.get('/all/:parentId', function(req, res) {
    try {
        Event.find({"_id" : req.params.parentId})
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

router.get('/:eventId', function(req, res) {
    const id = req.params.eventId;
    var event = null;
    try {
        Event.find()
        .exec()
        .then(events => {
            if (events.length == 0) {
                return res.sendStatus(404);
            } else {
                events.map(x => {
                    x.data.forEach(y => {
                        if (y._id == id) {
                            event = y;
                        }
                    });
                });

                if (event) {
                    return res.json(event);
                } else {
                    return res.sendStatus(404);
                }
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

router.delete('/all/:parentId', function(req, res) {
    const id = req.params.parentId;
    try {
        Event.findByIdAndRemove(id)
            .then(event => {
                console.log("lol")
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


router.delete('/:eventId', function(req, res) {
    var id = req.params.eventId;
    try {
        var parentId = null;
        var newList = null;
        Event.find()
        .exec()
        .then(events => {
            if (events.length == 0) {
                return res.sendStatus(404);
            } else {
                var found = null;
                events.map(x => {
                    for (var i = 0; i < x.data.length; i++) {
                        if (x.data[i]._id == id) {
                            found = i;
                            parentId = x._id;
                            newList = x.data.pull({ _id: id });
                        }
                    }
                });

                // if there are no more events, then the whole object must be deleted
                if (newList.length == 0) {
                    Event.findByIdAndRemove(parentId)
                    .exec()
                    .then(event => {
                        if (!event) {
                            return res.status(404).send("Event not found with id " + id);
                        }
                        return res.sendStatus(200);
                    })
                    .catch(err => {
                        console.log(err);
                        if (err.code === 11000) {
                            return res.status(404).send("Event not found with id " + id);
                        }
                        return res.sendStatus(500);
                    })
                } else {
                    Event.findByIdAndUpdate(parentId, {data: newList}, {new: true})
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
                }
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

router.put('/all/:parentId', function(req, res) {
    const body = req.body;
    const id = req.params.parentId;
    try {
        var newList = null;
        var parentId = null;
        Event.find()
        .exec()
        .then(events => {
            if (events.length == 0) {
                return res.sendStatus(404);
            } else {
                var found = null;
                events.map(x => {
                    if (x._id == id) {
                        found = true;
                        x.data.forEach(y => {
                            if (body.calendarInfo) {
                                if (body.calendarInfo.title) {
                                    y.calendarInfo.allDay = body.calendarInfo.allDay;
                                    if (/^[a-zA-Z0-9- ]+$/.test(body.calendarInfo.title)) {
                                        y.calendarInfo.title = body.calendarInfo.title;
                                    } else {
                                        return res.sendStatus(404);
                                    }
                                    var startDate = new Date(body.calendarInfo.start);
                                    var endDate = new Date(body.calendarInfo.end);
                                    if (startDate <= endDate) {
                                        y.calendarInfo.start = startDate;
                                        y.calendarInfo.end = endDate;
                                    } else {
                                        return res.sendStatus(400);
                                    }
                                }
                            }
                            if (body.capacity) {
                                y.capacity = body.capacity;
                            }
                            if (body.location) {
                                y.location = body.location;
                            }
                            if (body.description) {
                                y.description = body.description;
                            }
                            if (body.activationDay) {
                                y.activationDay = new Date(body.activationDay);
                            }
                            if (body.instructor) {
                                y.instructor = body.instructor;
                            }
                            if (body.registeredEmail) {
                                y.registeredEmail = body.registeredEmail;
                                y.markModified('registeredEmail');
                            }

                            newList = x.data;
                            parentId = x._id;
                        });
                    }

                    if (found) {
                        
                    }
                });
                Event.findByIdAndUpdate(parentId, {data: newList}, {new: true})
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

router.put('/:eventId', function(req, res) {
    const body = req.body;
    const id = req.params.eventId;
    try {
        var parentId = null;
        var newList = null;
        Event.find()
        .exec()
        .then(events => {
            if (events.length == 0) {
                return res.sendStatus(404);
            } else {
                var found = false;
                events.map(x => {
                    x.data.forEach(y => {
                        if (y._id == id) {
                            found = true;
                            // the event associated with the eventId has been found, validate & update the necessary fields
                            if (body.calendarInfo) {
                                if (body.calendarInfo.title) {
                                    y.calendarInfo.allDay = body.calendarInfo.allDay;
                                    if (/^[a-zA-Z0-9- ]+$/.test(body.calendarInfo.title)) {
                                        y.calendarInfo.title = body.calendarInfo.title;
                                    } else {
                                        return res.sendStatus(404);
                                    }
                                    var startDate = new Date(body.calendarInfo.start);
                                    var endDate = new Date(body.calendarInfo.end);
                                    if (startDate <= endDate) {
                                        y.calendarInfo.start = startDate;
                                        y.calendarInfo.end = endDate;
                                    } else {
                                        return res.sendStatus(400);
                                    }
                                }
                            }
                            if (body.capacity) {
                                y.capacity = body.capacity;
                            }
                            if (body.location) {
                                y.location = body.location;
                            }
                            if (body.description) {
                                y.description = body.description;
                            }
                            if (body.activationDay) {
                                y.activationDay = new Date(body.activationDay);
                            }
                            if (body.instructor) {
                                y.instructor = body.instructor;
                            }
                            if (body.registeredEmail) {
                                y.registeredEmail = body.registeredEmail;
                                y.markModified('registeredEmail');
                            }

                            parentId = x._id;
                            newList = x.data;
                        }
                    });

                });
                Event.findByIdAndUpdate(parentId, {data: newList}, {new: true})
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

router.post('/', function(req, res) {
    const body = req.body;
    try {
        var filtered = 
            body.filter(e => {
                var startDate = new Date(e.calendarInfo.start);
                var endDate = new Date(e.calendarInfo.end);
                var activationDay = new Date(e.activationDay);
                var capacity = Number(e.capacity);

                if (!/^[#/&a-zA-Z0-9- ]+$/.test(e.calendarInfo.title)) {
                    return false;
                }
        
                if (startDate > endDate) {
                    return false;
                }
        
                if (!/^[0-9a-zA-Z- ]+$/.test(e.location)) {
                    return false;
                }

                return true;
            });

        if (body.length == filtered.length) {
            var events = new Event({ data: filtered });

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
