const express = require('express');
const getAccessToken = require('../controllers/fbCallback');
const router = express.Router();

router.get('/', getAccessToken);

module.exports = router;