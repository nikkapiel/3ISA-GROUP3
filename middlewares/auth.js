const { verify } = require('jsonwebtoken');
const ExceptionHandler = require('../utils/ExceptionHandler');

exports.verify = (req) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader)  throw new ExceptionHandler('No token provided', 403);

    const token = authHeader.split(' ')[1];

    const { id } = verify(token, process.env.TOKEN_KEY);
    return id;
}