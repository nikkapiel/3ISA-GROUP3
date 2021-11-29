module.exports = (req, res, next) => {
    const allowedRequests = [ 'POST', 'GET', 'PUT', 'DELETE' ];
    const { method } = req;
    if (allowedRequests.includes(method)) {
        next();
    }
    else {
        res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }
};