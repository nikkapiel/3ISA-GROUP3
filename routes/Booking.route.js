const router = require('express').Router();
const {
    getAllBookings,
    createBooking, 
    getAvailableDates,
    checkExactDate,
    editBooking,
    deleteBooking
} = require('../controllers/Booking.controller');

// get all bookings
router.get('/all', getAllBookings);

// create a booking
router.post('/add', createBooking)

// get all available bookings
router.get('/available/:year/:month', getAvailableDates);

// check if exact date is available
router.get('/check/:date', checkExactDate);

// edit a booking
router.put('/edit/:findDate', editBooking);

// delete a booking
router.delete('/delete/:date', deleteBooking);
module.exports = router;