const express = require('express');
const facebookAuthenticator = require('../controllers/fbAuthentication');
const router = express.Router();

router.get('/', facebookAuthenticator);

module.exports = router;