const express = require('express');
const { fetchFacebookData } = require('../controllers/fetchFbData');
const router = express.Router();

router.get('/', fetchFacebookData);

module.exports = router;
