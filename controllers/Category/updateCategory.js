const mongoose = require('mongoose');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const updateCategoryController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                categoryId: joi.string().min(12).required(),
                name: joi.string()
            });

            await schema.validateAsync({
                categoryId: req?.query?.categoryId,
                ...req?.body
            })

            next();
        } catch (err) {
            console.log(err, 'updateCategoryValidationError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    },
    handler: async (req, res, next) => {
        try {
            const categoryId = req?.query?.categoryId;

            const reqBody = req?.body;

            const updatedCategoryInDB = await global?.models?.CATEGORY?.findOneAndUpdate(
                {
                    _id: new mongoose.Types.ObjectId(categoryId)
                },
                {
                    ...reqBody
                },
                {
                    new: true
                }
            );

            const updatedCategoryDoc = updatedCategoryInDB?.leanDoc();

            if (updatedCategoryDoc?._id) {
                res?.status(200)?.json({
                    payload: {
                        updatedCategory: updatedCategoryDoc
                    }
                });
            } else {
                res?.status(500)?.json({
                    errorMessage: responseErrorMessages?.SOME_ERROR_OCCURED
                });
            }
        } catch (err) {
            console.log(err, 'updateCategoryHandlerError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    updateCategoryController
}