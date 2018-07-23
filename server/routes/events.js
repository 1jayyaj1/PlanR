var express = require('express');
var router = express.Router();
let Event =  require('../models/event');

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
    res.sendStatus(404);
}
});



// router.get('/', function(req, res, next) {
//     let event = new Event({
//         name: "Zumba",
//         startDate: new Date(),
//         endDate: new Date(),
//         capacity: 30,
//         location: "Gym",
//         isRecurrent: false,
//         description: "test",
//         allDay: false,
//         recurrenceType: "Biweekly",
//         daysSelected: []
//     });

//     event.save()
//         .then(event => {
//             res.send(event)
//         })
//         .except(event => {
//             console.log("SHIT");
//         })
//   });

  module.exports = router;