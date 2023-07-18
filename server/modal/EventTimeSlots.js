const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeSlotSchema = new Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    // createdBy: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
