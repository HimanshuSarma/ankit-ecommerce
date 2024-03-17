const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const { otpGen } = require('otp-gen-agent');

const { sendPhoneVerificationOTPHandler } = require('../../services/verification/phoneVerificationHandlers')

const { responseErrorMessages } = require('../../staticData/responseErrorMessages')

const customerLoginController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                phoneNumber: joi.string().length(10).required(),
                // password: joi.string().required()
            });

            await schema.validateAsync(req?.body);
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

            let customerInDB;
            let newCustomerInDB;

            const updatedCustomerFromDB = await global?.models?.CUSTOMER?.findOneAndUpdate(
                { phoneNumber: reqPayload?.phoneNumber },
                {
                    phoneVerificationOtp: newOtp
                },
                { new: true }
            );


            if (!updatedCustomerFromDB?._id) {
                const newCustomer = {
                    ...reqPayload,
                    phoneVerificationOtp: newOtp
                };

                newCustomerInDB = await global?.models?.CUSTOMER?.create(
                    newCustomer
                );

                customerInDB = newCustomerInDB;
            } else {
                customerInDB = updatedCustomerFromDB;
            }

            const otpRes = await sendPhoneVerificationOTPHandler({
                phoneNumber: customerInDB?.phoneNumber,
                newOtp
            });

            if (otpRes?.success) {
                res?.status(200)?.json({
                    message: responseErrorMessages?.OTP_SENT_SUCCESSFULLY
                });
            } else {
                throw new Error(otpRes?.errorMessage);
            }
        } catch (err) {
            console.log(err, 'customer login error');
            res?.status(500).json({
                errorMessage: err?.message || err?.errorMessage
            });
        }
    }
};

module.exports = {
    customerLoginController
}