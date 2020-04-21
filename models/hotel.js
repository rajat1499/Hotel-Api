const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema;

const hotelSchema = new mongoose.Schema({
    name:{ 
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description:{
        type: String,
        trim: true,
        required: true,
        maxlength: 2000
    },  
    price: {
        type: Number,
        required: true,
        maxlength: 32,
        trim: true
    },
    category:{
        type: ObjectId,
        ref: "Category",
        required: true
    },
    roomsAvailable:{
        type: Number
    },
    roomsbooked:{
        type: Number,
        default: 0
    },
    photo:{
        data: Buffer,
        contentType: String
    }
}, 
{timestamps: true}
);

module.exports = mongoose.model("Hotel", hotelSchema);