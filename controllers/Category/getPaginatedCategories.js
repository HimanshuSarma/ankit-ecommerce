const mongoose = require('mongoose');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const getPaginatedCategoriesController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                pageNo: joi.number().required(),
                limit: joi.number().required(),
                searchQuery: req?.query?.searchQuery
            });

            const params = {
                pageNo: parseInt(req?.query?.pageNo),
                limit: parseInt(req?.query?.limit),
                searchQuery: req?.query?.searchQuery
            }

            await schema.validateAsync(params);

            req.query = {
                ...params
            }
            next();
        } catch (err) {
            console.log(err, 'getPaginatedCategoriesValidationError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    },
    handler: async (req, res, next) => {
        try {

            const pageNo = req?.query?.pageNo;
            const limit = req?.query?.limit;
            const searchQuery = req?.query?.searchQuery;

            const fetchedCategoriesFromDB = await global?.models?.CATEGORY?.find(
                {
                    name: {
                        $regex: searchQuery || ''
                    }
                }
            )?.skip((pageNo - 1) * limit)?.limit(limit);

            if (fetchedCategoriesFromDB) {
                res?.status(200)?.json({
                    payload: {
                        categories: fetchedCategoriesFromDB
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
    getPaginatedCategoriesController
}