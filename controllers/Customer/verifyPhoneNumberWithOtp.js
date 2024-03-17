const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const verifyPhoneNumberWithOtpController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                phoneNumber: joi.string().length(10).required(),
                phoneVerificationOtp: joi.string().required()
            });
    
            const reqPayload = req?.body;
    
            await schema.validateAsync(reqPayload);

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

            const fetchedCustomerFromDB = await global?.models?.CUSTOMER?.findOneAndUpdate(
                { 
                    phoneNumber: reqPayload?.phoneNumber,
                    phoneVerificationOtp: reqPayload?.phoneVerificationOtp
                },
                {
                    isPhoneNumberVerified: true
                },
                { new: true }
            );

            const fetchedCustomerDoc = fetchedCustomerFromDB?.leanDoc();

            if (fetchedCustomerFromDB?._id) {
                const token = jwt.sign(fetchedCustomerDoc, process.env.JWT_SECRET);
                res?.status(200)?.json({
                    payload: {
                        item: {
                            token,
                            customerDoc: fetchedCustomerDoc
                        }
                    },
                    message: responseErrorMessages?.PHONE_OTP_VERIFICATION_SUCCESSFUL
                });
            } else {
                throw new Error(`Some error occured(The provided otp might be incorrect)`);
            }
        } catch (err) {
            console.log(err, 'verifyPhoneNumberWithOtpControllerError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    verifyPhoneNumberWithOtpController
};