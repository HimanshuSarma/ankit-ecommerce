const express = require('express');

const { customerSignupController } = require('../controllers/Customer/customerSignup');
const { customerLoginController } = require('../controllers/Customer/customerLogin');
const { sendPhoneVerificationController } = require('../controllers/Customer/sendPhoneVerificationOTP');
const { verifyPhoneNumberWithOtpController } = require('../controllers/Customer/verifyPhoneNumberWithOtp');

const customerRoutes = express.Router();

// All POST routes start...
customerRoutes.post(`/signup`, 
    customerSignupController.validation,
    customerSignupController.handler
);

customerRoutes.post(`/login`, 
    customerLoginController.validation,
    customerLoginController.handler
);
// All POST routes end...

// All PUT routes start...
customerRoutes.put(`/verifyPhoneWithOtp`, 
    verifyPhoneNumberWithOtpController?.validation,
    verifyPhoneNumberWithOtpController?.handler
);
// All PUT routes end...

// All GET routes start...
customerRoutes.get(`/sendPhoneVerificiationOtp`, 
    verifyPhoneNumberWithOtpController?.validation,
    verifyPhoneNumberWithOtpController?.handler
);
// All GET routes end...

module.exports = {
    customerRoutes
}