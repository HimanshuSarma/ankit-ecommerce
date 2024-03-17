const express = require('express');

const { verifySuperadminMiddleware } = require('../middlewares/verifySuperadminMiddleware');

const { adminLoginController } = require('../controllers/Admin/adminLogin');
const { adminCreateController } = require('../controllers/Admin/adminCreate');
const { sendPhoneVerificationController } = require('../controllers/Admin/sendPhoneVerificationOTP');
const { verifyPhoneNumberWithOtpController } = require('../controllers/Admin/verifyPhoneNumberWithOtp');

const adminRoutes = express.Router();

// All POST routes start...
adminRoutes.post(`/create`, 
    verifySuperadminMiddleware,
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