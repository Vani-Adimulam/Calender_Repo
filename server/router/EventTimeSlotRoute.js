const express = require("express");
const EventTimeSlotRoute = express.Router();
const { createTimeSlot, getTimeSlotsBetweenDates, updateTimeSlot, deleteTimeSlot } = require('../controller/EventTimeSlotController');
EventTimeSlotRoute.post('/createT-event', createTimeSlot);
EventTimeSlotRoute.get('/getT-event', getTimeSlotsBetweenDates);
EventTimeSlotRoute.put('/updateT-event/:id', updateTimeSlot);
EventTimeSlotRoute.delete('/deteteT-event/:id', deleteTimeSlot);

module.exports = EventTimeSlotRoute;
