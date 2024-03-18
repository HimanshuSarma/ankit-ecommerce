const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const { otpGen } = require('otp-gen-agent');

const { sendPhoneVerificationOTPHandler } = require('../../services/verification/phoneVerificationHandlers');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const sendPhoneVerificationController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                phoneNumber: joi.string().length(10).required()
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
            const newOtp = await otpGen();

            const updatedCustomerPhoneVerificationOtp = await global?.models?.CUSTOMER?.findOneAndUpdate(
                { 
                    email: reqPayload?.email,
                },
                {
                    phoneVerificationOtp: newOtp
                },
                { new: true }
            );

            if (updatedCustomerPhoneVerificationOtp?._id) {

                if (updatedCustomerPhoneVerificationOtp?._id && updatedCustomerPhoneVerificationOtp?.phoneVerificationOtp === newOtp) {
                    const otpRes = await sendPhoneVerificationOTPHandler({
                        phoneNumber: updatedCustomerPhoneVerificationOtp?.phoneNumber,
                        newOtp
                    });

                    if (otpRes?.success) {
                        res?.status(200)?.json({
                            message: responseErrorMessages?.OTP_SENT_SUCCESSFULLY
                        });
                    } else {
                        throw new Error(otpRes?.errorMessage);
                    }
                } else {
                    res?.status(500).json({
                        errorMessage: `An error occured in generating the otp!`
                    });
                }
            } else {
                throw new Error(`Some error occured`);
            }
        } catch (err) {
            console.log(err, 'sendPhoneVerificationOTPError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    sendPhoneVerificationController
};