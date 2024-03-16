const express = require('express');

const { verifyJWTMiddleware } = require('../middlewares/verifyJWTMiddleware');

const { adminLoginController } = require('../controllers/Admin/adminLogin');
const { adminCreateController } = require('../controllers/Admin/adminCreate');
const { sendPhoneVerificationController } = require('../controllers/Admin/sendPhoneVerificationOTP');
const { verifyPhoneNumberWithOtpController } = require('../controllers/Admin/verifyPhoneNumberWithOtp');

const adminRoutes = express.Router();

// All POST routes start...
adminRoutes.post(`/create`, 
    (req, res, next) => { 
        verifyJWTMiddleware(req, res, next, (payload) => {
            req.admin = payload;
        });
    },
    adminCreateController?.validation,
    adminCreateController?.handler
);

adminRoutes.post(`/login`, 
    adminLoginController?.validation,
    adminLoginController?.handler
);
// All POST routes end...

// All PUT routes start...
adminRoutes.put(`/verifyPhoneWithOtp`, 
    verifyPhoneNumberWithOtpController?.validation,
    verifyPhoneNumberWithOtpController?.handler
);
// All PUT routes end...

// All GET routes start...
adminRoutes.get(`/sendPhoneVerificiationOtp`, 
    sendPhoneVerificationController?.validation,
    sendPhoneVerificationController?.handler
);
// All GET routes end...

module.exports = {
    adminRoutes
}