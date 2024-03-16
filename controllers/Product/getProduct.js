const mongoose = require('mongoose');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const getProductController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                productId: joi.string().min(12).required()
            });

            console.log(req?.query, 'getProduct');

            await schema.validateAsync({
                productId: req?.query?.productId
            })

            next();
        } catch (err) {
            console.log(err, 'getProductValidationError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    },
    handler: async (req, res, next) => {
        try {

            const productId = req?.query?.productId;

            console.log(productId, 'productId');

            const fetchedProductInDB = await global?.models?.PRODUCT.findOne(
                { _id: new mongoose.Types.ObjectId(productId) }
            );

            console.log(fetchedProductInDB, 'fetched')

            if (fetchedProductInDB?._id) {
                res?.status(200)?.json({
                    payload: {
                        item: fetchedProductInDB
                    },
                    message: responseErrorMessages?.SUCCESS
                })
            } else {
                throw new Error(`Some error occured!`);
            }
        } catch (err) {
            console.log(err, 'getProductHandlerError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    getProductController
}