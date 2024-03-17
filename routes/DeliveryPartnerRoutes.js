const express = require('express');

const { createDeliveryPartnerController } = require('../controllers/DeliveryPartener/createDeliveryPartner');
const { sendPhoneVerificationOTPController } = require('../controllers/DeliveryPartener/sendPhoneVerificationOTP');

const { verifySuperadminMiddleware } = require('../middlewares/verifySuperadminMiddleware');

const deliveryPartnerRoutes = express.Router();

// All POST routes start...
deliveryPartnerRoutes.post(`/create`, 
    verifySuperadminMiddleware,
    createDeliveryPartnerController?.validation,
    createDeliveryPartnerController?.handler
);

// deliveryPartnerRoutes.post(`/login`, 
//     adminLoginController?.validation,
//     adminLoginController?.handler
// );
// All POST routes end...

// All PUT routes start...
// deliveryPartnerRoutes.put(`/verifyPhoneWithOtp`, 
//     verifyPhoneNumberWithOtpController?.validation,
//     verifyPhoneNumberWithOtpController?.handler
// );
// All PUT routes end...

// All GET routes start...
deliveryPartnerRoutes.get(`/sendPhoneVerificiationOtp`, 
    sendPhoneVerificationOTPController?.validation,
    sendPhoneVerificationOTPController?.handler
);
// All GET routes end...

module.exports = {
    deliveryPartnerRoutes
}