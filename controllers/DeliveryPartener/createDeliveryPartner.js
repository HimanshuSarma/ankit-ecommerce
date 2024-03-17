const joi = require('joi');
const { otpGen } = require('otp-gen-agent');

const { sendPhoneVerificationOTPHandler } = require('../../services/verification/phoneVerificationHandlers');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const createDeliveryPartnerController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                name: joi.string(),
                phoneNumber: joi.string().length(10).required(),
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
            const newDeliveryPartner = reqBody;

            const newDeliveryPartnerInDB = await global?.models?.DELIVERY_PARTNER?.create(
                newDeliveryPartner,
            );

            if (newDeliveryPartnerInDB?._id) {
                res?.status(200)?.json({
                    message: responseErrorMessages?.RESOURCE_CREATED_SUCCESSFULLY + "delivery partner!"
                });
            } else {
                throw new Error(responseErrorMessages?.SOME_ERROR_OCCURED);
            }
        } catch (err) {
            console.log(err, 'create delivery partner error');
            res?.status(500).json({
                errorMessage: err?.message || err?.errorMessage
            });
        }
    }
};

module.exports = {
    createDeliveryPartnerController
}