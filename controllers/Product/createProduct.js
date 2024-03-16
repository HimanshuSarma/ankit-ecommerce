const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');
const { default: mongoose } = require('mongoose');

const createProductController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                name: joi.string().required(),
                price: joi.number().required(),
                categoryId: joi.string().min(12).required(),
                createdBy: joi.string().min(12).required()
            });
    
            const reqPayload = req?.body;
    
            await schema.validateAsync({
                name: reqPayload?.name,
                price: reqPayload?.price,
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

            console.log(req?.files, req?.file, 'files');

            const newProduct = {
                name: reqPayload?.name,
                price: reqPayload?.price,
                categoryId: reqPayload?.categoryId,
                createdBy: admin?._id
            };

            const fetchedCategoryInDB = await global?.models?.CATEGORY?.findOne(
                { _id: new mongoose.Types.ObjectId(reqPayload?.categoryId) }
            );

            if (fetchedCategoryInDB?._id) {
                const newProductInDB = await global?.models?.PRODUCT?.create(newProduct);

                if (newProductInDB?._id) {
                    res?.status(200)?.json({
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