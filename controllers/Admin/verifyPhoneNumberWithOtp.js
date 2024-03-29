const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const verifyPhoneNumberWithOtpController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                email: joi.string().email({ tlds: { allow: false } }).required(),
                phoneVerificationOtp: joi.string().required()
            });
    
            const reqPayload = req?.body;
    
            await schema.validateAsync({
                email: reqPayload?.email,
                phoneVerificationOtp: reqPayload?.phoneVerificationOtp
            });

            next();
        } catch (err) {
            res?.status(400).json({
                errorMessage: err?.message
            });
        }
        
    },
    handler: async (req, res, next) => {
        try {

            const reqPayload = req?.body;

            const fetchedAdminFromDB = await global?.models?.ADMIN?.findOneAndUpdate(
                { 
                    email: reqPayload?.email,
                    phoneVerificationOtp: reqPayload?.phoneVerificationOtp
                },
                {
                    isPhoneNumberVerified: true
                }
            );

            if (fetchedAdminFromDB?._id) {
                res?.status(200)?.json({
                    message: responseErrorMessages?.PHONE_OTP_VERIFICATION_SUCCESSFUL
                });
            } else {
                throw new Error(`Some error occured`);
            }
        } catch (err) {
            console.log(err, 'admin login error');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    verifyPhoneNumberWithOtpController
};