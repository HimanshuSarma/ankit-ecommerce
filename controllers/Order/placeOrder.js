const joi = require('joi');
const mongoose = require('mongoose');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages')

const placeOrderController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                orderId: joi.string().min(12).required(),
                orderPaymentId: joi.string().required()
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

            const placedOrderInDB = await global?.models?.ORDER.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(reqBody?.orderId) },
                {
                    status: 'placed',
                    orderPaymentId: reqBody?.orderPaymentId
                },
                { new: true }
            );

            if (placedOrderInDB?._id) {
                res?.status(200)?.json({
                    payload: {
                        item: placedOrderInDB
                    }
                });
            } else {
                throw new Error(responseErrorMessages?.SOME_ERROR_OCCURED)
            }
        } catch (err) {
            res?.status(500).json({
                errorMessage: err?.message || err?.errorMessage
            });
        }
    }
};

module.exports = {
    placeOrderController
}