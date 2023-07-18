const TimeSlot = require('../modal/EventTimeSlots');

// Create a new time slot
const createTimeSlot = (req, res, next) => {
  const { startTime, endTime } = req.body;
//   const createdBy = req.user.id; // Assuming you have implemented user authentication middleware

  const timeSlot = new TimeSlot({
    startTime,
    endTime,
    // createdBy
  });

  timeSlot.save()
    .then(result => {
      res.status(201).json({
        message: 'Time slot created successfully',
        timeSlot: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

// Get all time slots between two dates
const getTimeSlotsBetweenDates = (req, res, next) => {
  const { startDate, endDate } = req.params;

  TimeSlot.find({
    startTime: { $gte: startDate },
    endTime: { $lte: endDate }
  })
    .then(timeSlots => {
      res.status(200).json({
        message: 'Time slots fetched successfully',
        timeSlots
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};  

// Update a time slot
const updateTimeSlot = (req, res, next) => {
  const { startTime, endTime } = req.body;
  const timeSlotId = req.params.id;

  TimeSlot.findById(timeSlotId)
    .then(timeSlot => {
      if (!timeSlot) {
        return res.status(404).json({
          message: 'Time slot not found'
        });
      }

      timeSlot.startTime = startTime;
      timeSlot.endTime = endTime;

      return timeSlot.save();
    })
    .then(result => {
      res.status(200).json({
        message: 'Time slot updated successfully',
        timeSlot: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

// Delete a time slot
const deleteTimeSlot = (req, res, next) => {
  const timeSlotId = req.params.id;

  TimeSlot.findByIdAndRemove(timeSlotId)
    .then(() => {
      res.status(200).json({
        message: 'Time slot deleted successfully'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

module.exports = {createTimeSlot, getTimeSlotsBetweenDates, updateTimeSlot, deleteTimeSlot }
