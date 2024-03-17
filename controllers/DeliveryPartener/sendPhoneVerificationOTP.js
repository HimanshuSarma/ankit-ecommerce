const joi = require('joi');
const { otpGen } = require('otp-gen-agent');

const { sendPhoneVerificationOTPHandler } = require('../../services/verification/phoneVerificationHandlers');

const { resourceNotFoundErrorMessage } = require('../../utils/errors/errorMessageHandlers');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const sendPhoneVerificationOTPController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                phoneNumber: joi.string().length(10).required()
            });

            const reqBody = req?.body;

            await schema.validateAsync(reqBody);
            next();
        } catch (err) {
            res?.status(400).json({
                errorMessage: err?.message
            });
        }
    },
    handler: async (req, res, next) => {
        try {

            const reqBody = req?.body;

            const newOtp = await otpGen();

            const fetchedDeliveryPartnerFromDB = await global?.models?.DELIVERY_PARTNER?.findOne(
                { phoneNumber: reqBody?.phoneNumber }
            );

            if (fetchedDeliveryPartnerFromDB?._id) {
                const otpRes = await sendPhoneVerificationOTPHandler({
                    phoneNumber: fetchedDeliveryPartnerFromDB?.phoneNumber,
                    newOtp
                });

                if (otpRes?.success) {
                    res?.status(200)?.json({
                        message: responseErrorMessages?.OTP_SENT_SUCCESSFULLY
                    });
                } else {
                    throw new Error(`Delivery partner record stored in db, but some error occured in sending the OTP(${otpRes?.errorMessage})`);
                }
            } else {
                throw new Error(resourceNotFoundErrorMessage({
                    resouce: `Delivery partner with given phoneNumber`
                }));
            }
        } catch (err) {
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    sendPhoneVerificationOTPController
}