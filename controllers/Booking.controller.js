const Booking = require("../models/Booking.model");
const ExceptionHandler = require("../utils/ExceptionHandler");
const ManageDates = require("../utils/ManageDates");

exports.getAllBookings = async (req, res, next) => {
  try {
      await Booking.find()
        .then(data=>{
            res.json({
                status: true,
                data
            })
        })
        .catch(err => {
            res.json({
                status: true,
                message: err
            })
            throw err;
        });
  } catch (error) {
      return next(error);
  }
};

exports.createBooking = async (req, res, next) => {
    const { title, date } = req.body;
    try {
        if(!title || !date) return new ExceptionHandler("Please provide title and date", 400);

        await Booking.create({
            title,
            date
        })
        .then(data=>{
            res.json({
                status: true,
                data
            })
        })
        .catch(err => {
            throw err;
        });
    } catch (error) {
        return next(error);
    }
}

exports.getAvailableDates = async (req, res, next) => {
    const { year, month } = req.params;
    try {  
        const mgDates = new ManageDates(year, month);

        const data = await Booking.find({
            date: {
                '$gte': mgDates.startDate(),
                '$lte': mgDates.endDate()
            }
        })
        .then(result=>{
            const date = result.map(item=>item.date);
            if(date.length === 0) return res.json({  
                status: true,
                result: {
                    status: true,
                    data: [],
                    message: "All dates are free."
                }
            });
            if(date.length === mgDates.endDay()) return res.json({  
                status: true,
                result: {
                    status: false,
                    data: [],
                    message: `No available dates for ${month} ${year}`
                }
            });
            const availableDates = mgDates.getAvailableDates(date);
            res.json({  
                status: true,
                result: {
                    status: true,
                    data: availableDates,
                    message: `All available dates for ${month} ${year}.`
                }
            });
        })
        .catch(err => {
            throw err;
        });
    } catch (error) {
        return next(error);
    }
}   

exports.editBooking = async (req, res, next) => {
    const { findDate } = req.params
    const { title, date } = req.body;
    try {
        let toEdit = {};
        if(!date) toEdit.title = title;
        if(!title) toEdit.date = date;
        if(title && date) toEdit = {title, date};
        if(!title && !date) return new ExceptionHandler("Please provide title or date", 400);

        await Booking.findOneAndUpdate({
            date: findDate
        }, toEdit)
        .then(data=>{
            res.json({
                status: true,
                data
            })
        })
        .catch(err => {
            throw err;
        });
    } catch (error) {
        return next(error);
    }
}

exports.deleteBooking = async (req, res, next) => {
    const { date } = req.params;

    try {
        await Booking.findOneAndDelete({
            date
        })
        .then(data=>{
            res.json({
                status: true,
                data
            })
        })
        .catch(err => {
            throw err;
        });
    } catch (error) {
        return next(error);
    }
}

exports.checkExactDate = async (req, res, next) => {    
    const { date } = req.params;
    try {
        await Booking.findOne({
            date
        })
        .then(data=>{
            if(data) return res.json({
                status: true,
                data
            })
            res.json({
                status: false,
                message: "No booking found for this date."
            })
        })
        .catch(err => {
            throw err;
        });
    } catch (error) {
        return next(error);
    }
}