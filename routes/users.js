const express = require('express');
const { getDeatils, changePassword } = require('../controllers/users');
const router = express.Router();

router.get('/user-deatils',getDeatils);
router.put('/change-password',changePassword);


module.exports=router;