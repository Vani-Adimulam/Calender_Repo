const { default: mongoose } = require("mongoose");

const SlotRequestSchema = new mongoose.Schema({
    UserReq:{
        type:String,
        required:true
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        
    }
});

const SlotRequest = mongoose.modal('SlotRequest', SlotRequestSchema);

module.exports = SlotRequest;