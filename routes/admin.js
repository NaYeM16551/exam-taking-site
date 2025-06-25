const express = require('express');
const { adminDasboard } = require('../controllers/admin');
const router = express.Router();

router.route('adminn-dashboard').get(adminDasboard);



module.exports =router;