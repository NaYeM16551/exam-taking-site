const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors');

const adminDasboard = (req,res)=>{

    req.user.isAdmin=true;

    if(!req.user.isAdmin){
        throw new UnauthenticatedError('Unauthorized to access admin dashboard');
    }
    res.status(StatusCodes.OK).json({msg: 'Admin dashboard'});

}

module.exports = {adminDasboard};