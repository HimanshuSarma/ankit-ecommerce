const mongoose = require('mongoose');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const getPaginatedProductsByCategoryController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                pageNo: joi.number().required(),
                limit: joi.number().required(),
                categoryId: joi.string().min(12).required(),
                searchQuery: joi.string()
            });

            const params = {
                pageNo: parseInt(req?.query?.pageNo),
                limit: parseInt(req?.query?.limit),
                categoryId: req?.query?.categoryId,
                searchQuery: req?.query?.searchQuery
            }

            await schema.validateAsync(params);

            req.query = {
                ...params
            }
            next();
        } catch (err) {
            console.log(err, 'getPaginatedProductsByCategoryValidationError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    },
    handler: async (req, res, next) => {
        try {

            const pageNo = req?.query?.pageNo;
            const limit = req?.query?.limit;
            const categoryId = req?.query?.categoryId;
            const searchQuery = req?.query?.searchQuery;

            const fetchedProductsByCategoryFromDB = await global?.models?.PRODUCT.find(
                {
                    name: {
                        $regex: searchQuery || ''
                    },
                    categoryId: new mongoose.Types.ObjectId(categoryId)
                }
            )?.skip((pageNo - 1) * limit)?.limit(limit);

            if (fetchedProductsByCategoryFromDB) {
                res?.status(200)?.json({
                    payload: {
                        products: fetchedProductsByCategoryFromDB
                    },
                    message: responseErrorMessages?.SUCCESS
                })
            } else {
                throw new Error(`Some error occured!`);
            }
        } catch (err) {
            console.log(err, 'error');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    getPaginatedProductsByCategoryController
}