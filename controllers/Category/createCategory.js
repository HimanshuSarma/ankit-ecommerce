const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const createCategoryController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                name: joi.string().required(),
                createdBy: joi.string().min(12).required()
            });
    
            const reqPayload = req?.body;
    
            await schema.validateAsync({
                name: reqPayload?.name,
                createdBy: req?.admin?._id
            });

            next();
        } catch (err) {
            console.log(err, 'createCategoryValidationError');
            res?.status(400).json({
                errorMessage: err?.message
            });
        }
        
    },
    handler: async (req, res, next) => {
        try {

            const reqPayload = req?.body;
            const admin = req?.admin;

            const newCategory = {
                name: reqPayload?.name,
                createdBy: admin?._id
            };

            const newCategoryInDB = await global?.models?.CATEGORY?.create(newCategory);

            if (newCategoryInDB?._id) {
                res?.status(200)?.json({
                    payload: {
                        category: newCategoryInDB
                    },
                    message: responseErrorMessages?.SUCCESS
                })
            } else {
                throw new Error(`Some error occured`);
            }
        } catch (err) {
            console.log(err, 'createCategoryHandlerError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    createCategoryController
};