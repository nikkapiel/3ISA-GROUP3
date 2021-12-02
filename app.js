const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectToDB } = require('./secrets/dbConn');
const path = require('path');

const app = express();

// COOKIE PARSER
app.use(cookieParser());

// use cors middleware
app.use(cors({
    credentials: true
}));

// parse application/json
app.use(express.json());

// limit method requests
app.use(require('./middlewares/limitRequest'));


// add route /booking
app.use('/booking', require('./routes/Booking.route'));

// add route /admin
app.use('/admin', require('./routes/Admin.route'));

// serve the frontend
// 
app.use(express.static(path.join(__dirname,'client')));
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client','index.html'));
})  
app.get('/about', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client','about.html'));
})  
app.get('/packages', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client','packages.html'));
})  
app.get('/calendar', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client','calendar2.html'));
})  
app.get('/appointment', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client','appointment.html'));
})  
app.get('/contact', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client','contact.html'));
})  
app.get('/owner/login', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client','log.html'));
})  
app.get('/owner/schedInfo', (req,res)=>{
    res.sendFile(path.join(__dirname, 'client','schedinfo.html'));
})  
// //

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// connect to database
connectToDB();

// error handler middleware
app.use(require('./middlewares/errorHandler'));

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});