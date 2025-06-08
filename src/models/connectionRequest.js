const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromOurUserId: {
      type : mongoose.Schema.Types.ObjectId ,
      required: true 
    },
    toOtherUserId: {
      type : mongoose.Schema.Types.ObjectId ,
      required: true
    },
    status: {
      type: String,
      required: true,
        enum: {
            values : ['ignored' , 'interested' , 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status'
        }
    }      
}, {
    timestamps: true
})

const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequestModel;