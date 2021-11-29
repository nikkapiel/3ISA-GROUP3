const router = require('express').Router();
const {
    signup,
    login,
    authenticate
} = require('../controllers/Admin.controller');

router.post('/signup', signup);
router.post('/login', login);
router.post('/authenticate', authenticate);

module.exports = router;