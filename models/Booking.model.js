const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        unique: true
    },
},
{
    timestamps: true,
    collection: 'bookings'
});

module.exports = mongoose.model('Booking', BookingSchema);
