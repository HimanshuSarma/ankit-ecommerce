const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');
const mongoose = require('mongoose');

const updateProductController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                name: joi.string(),
                price: joi.number(),
                images: joi.array().items(
                    joi.object({
                        url: joi.string().min(1).required().regex(/https:\/\//),
                        description: joi.string()
                    })
                ),
                stock: joi.number().min(1),
                categoryId: joi.string().min(12),
                productId: joi.string().min(12).required(),
            });
    
            const reqPayload = req?.body;
    
            await schema.validateAsync({
                name: reqPayload?.name,
                price: reqPayload?.price,
                images: reqPayload?.images,
                stock: reqPayload?.stock,
                categoryId: reqPayload?.categoryId,
                productId: req?.query?.productId,
            });

            next();
        } catch (err) {
            console.log(err, 'updateProductValidationError');
            res?.status(400).json({
                errorMessage: err?.message
            });
        }
        
    },
    handler: async (req, res, next) => {
        try {

            const productId = req?.query?.productId;
            const reqPayload = req?.body;
            const admin = req?.admin;

            const updatedProduct = {};

            console.log(reqPayload, 'reqPayload');

            if (reqPayload?.name) {
                updatedProduct["name"] = reqPayload?.name;
            }

            if (reqPayload?.images) {
                updatedProduct["images"] = reqPayload?.images;
            }

            if (reqPayload?.price) {
                updatedProduct["price"] = reqPayload?.price;
            }

            if (reqPayload?.categoryId) {
                updatedProduct["categoryId"] = reqPayload?.categoryId;
            }

            if (reqPayload?.stock) {
                updatedProduct["stock"] = reqPayload?.stock;
            }

            const updatedProductInDB = await global?.models?.PRODUCT?.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(productId) },
                {
                    ...updatedProduct
                },
                {
                    new: true
                }
            );

            if (updatedProductInDB?._id) {
                const responseProductDoc = updatedProductInDB?.responseDoc();
                return res?.status(200)?.json({
                    payload: {
                        product: responseProductDoc
                    },
                    message: responseErrorMessages?.SUCCESS
                })
            } else {
                throw new Error(`Product doesn't exist`);
            }
        } catch (err) {
            console.log(err, 'createProductHandlerError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    updateProductController
};