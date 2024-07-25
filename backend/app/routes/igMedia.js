const express = require('express');
const { getAllMedia } = require('../controllers/igMedia');
const router = express.Router();

router.get('/', getAllMedia);

module.exports = router;
