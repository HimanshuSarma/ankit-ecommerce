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
                email: joi.string().email({ tlds: { allow: false } }).required(),
                password: joi.string().required()
            });
    
            const reqPayload = req?.body;
    
            await schema.validateAsync({
                email: reqPayload?.email,
                password: reqPayload?.password
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

            const fetchedCustomerFromDB = await global?.models?.CUSTOMER?.findOne(
                { email: reqPayload?.email }
            );

            if (fetchedCustomerFromDB?._id) {
                const passwordMatch = await bcrypt.compare(reqPayload?.password, fetchedCustomerFromDB?.password);
                if (passwordMatch) {
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

                    if (updatedCustomerPhoneVerificationOtp?._id && updatedCustomerPhoneVerificationOtp?.phoneVerificationOtp === newOtp) {
                        const otpRes = await sendPhoneVerificationOTPHandler({
                            phoneNumber: fetchedCustomerFromDB?.phoneNumber,
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
                    res?.status(400).json({
                        errorMessage: responseErrorMessages?.PASSWORD_DOESNOT_MATCH
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