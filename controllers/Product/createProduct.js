const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');
const mongoose = require('mongoose');

const createProductController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                name: joi.string().required(),
                price: joi.number().required(),
                images: joi.array().items(
                    joi.object({
                        url: joi.string().min(1).required().regex(/https:\/\//),
                        description: joi.string()
                    })
                ).required(),
                stock: joi.number().min(1).required(),
                categoryId: joi.string().min(12).required(),
                createdBy: joi.string().min(12).required()
            });
    
            const reqPayload = req?.body;
    
            await schema.validateAsync({
                name: reqPayload?.name,
                price: reqPayload?.price,
                images: reqPayload?.images,
                stock: reqPayload?.stock,
                categoryId: reqPayload?.categoryId,
                createdBy: req?.admin?._id
            });

            next();
        } catch (err) {
            console.log(err, 'createProductValidationError');
            res?.status(400).json({
                errorMessage: err?.message
            });
        }
        
    },
    handler: async (req, res, next) => {
        try {

            const reqPayload = req?.body;
            const admin = req?.admin;

            const newProduct = {
                name: reqPayload?.name,
                images: reqPayload?.images || [],
                price: reqPayload?.price,
                categoryId: reqPayload?.categoryId,
                stock: reqPayload?.stock,
                createdBy: admin?._id
            };

            const fetchedCategoryInDB = await global?.models?.CATEGORY?.findOne(
                { _id: new mongoose.Types.ObjectId(reqPayload?.categoryId) }
            );

            if (fetchedCategoryInDB?._id) {
                const newProductInDB = await global?.models?.PRODUCT?.create(newProduct);

                if (newProductInDB?._id) {
                    return res?.status(200)?.json({
                        payload: {
                            item: newProductInDB
                        },
                        message: responseErrorMessages?.SUCCESS
                    })
                } else {
                    throw new Error(`Some error occured`);
                }
            } else {
                throw new Error(`Category doesn't exist`);
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
    createProductController
};