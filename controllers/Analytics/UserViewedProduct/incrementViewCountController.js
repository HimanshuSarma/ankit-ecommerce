const joi = require('joi');
const mongoose = require('mongoose');

const { responseErrorMessages } = require('../../../staticData/responseErrorMessages');

const incrementViewCountController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                productId: joi.string().min(12).required()
            });

            const reqQueryParams = req?.query;

            await schema.validateAsync({
                productId: reqQueryParams?.productId
            });

            next();
        } catch (err) {
            console.log(err, 'userViewProductIncrementValidationError');
            res?.status(400).json({
                errorMessage: err?.message
            });
        }
    },
    handler: async (req, res, next) => {
        try {
            const reqQueryParams = req?.query;
            const user = req?.user;

            let newUserProductCount;
            let userViewedProductInDB;

            const incrementedCountInDB = await global?.models?.ANALYTICS_USER_VIEWED_PRODUCT?.findOneAndUpdate(
                { 
                    customerId: new mongoose.Types.ObjectId(user?._id),
                    productId: new mongoose.Types.ObjectId(reqQueryParams?.productId)
                },
                {
                    $inc: {
                        count: 1
                    }
                }
            );

            if (incrementedCountInDB?._id) {
                res?.status(200)?.json({
                    message: responseErrorMessages?.SUCCESS
                });
            } else {
                newUserProductCount = {
                    productId: new mongoose.Types.ObjectId(reqQueryParams?.productId),
                    customerId: new mongoose.Types.ObjectId(user?._id),
                    count: 1
                };

                userViewedProductInDB = await global?.models?.ANALYTICS_USER_VIEWED_PRODUCT?.create(newUserProductCount);

                if (userViewedProductInDB?._id) {
                    res?.status(200)?.json({
                        message: responseErrorMessages?.SUCCESS
                    });
                } else {
                    throw new Error(`Some error occured!`);
                }
            }
        } catch (err) {
            console.log(err, 'userViewProductHandlerError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    incrementViewCountController
}