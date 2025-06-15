const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromOurUserId: {
      type : mongoose.Schema.Types.ObjectId ,
      required: true ,
      ref: 'User' //reference to the User model
    },
    toOtherUserId: {
      type : mongoose.Schema.Types.ObjectId ,
      required: true ,
      ref: 'User' //reference to the User model
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

connectionRequestSchema.index({ fromOurUserId: 1, toOtherUserId: 1 });

connectionRequestSchema.pre('save' , function(next){
    const connectionRequest = this;
    
    // Check if the fromOurUserId and toOtherUserId are the same
    if(connectionRequest.fromOurUserId.equals(connectionRequest.toOtherUserId)) {
        throw new Error("You cannot send a connection request to yourself");
    }
    next();
})

const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequestModel;