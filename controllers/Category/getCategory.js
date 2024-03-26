const mongoose = require('mongoose');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const getCategoryController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                categoryId: joi.string().min(12).required()
            });

            console.log(req?.query, 'getCategory');

            await schema.validateAsync({
                categoryId: req?.query?.categoryId
            })

            next();
        } catch (err) {
            console.log(err, 'getCategoryValidationError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    },
    handler: async (req, res, next) => {
        try {

            const categoryId = req?.query?.categoryId;

            console.log(categoryId, 'categoryId');

            const fetchedCategoryInDB = await global?.models?.CATEGORY?.findOne(
                { _id: new mongoose.Types.ObjectId(categoryId) }
            );

            console.log(fetchedCategoryInDB, 'fetched')

            if (fetchedCategoryInDB?._id) {
                res?.status(200)?.json({
                    payload: {
                        category: fetchedCategoryInDB
                    },
                    message: responseErrorMessages?.SUCCESS
                })
            } else {
                throw new Error(`Some error occured!`);
            }
        } catch (err) {
            console.log(err, 'getCategoryHandlerError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    getCategoryController
}