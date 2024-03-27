const mongoose = require('mongoose');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const getPaginatedProductsController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                pageNo: joi.number().required(),
                limit: joi.number().required(),
                searchQuery: joi.string(),
                categoryId: joi.string().min(12),
                minPrice: joi.number(),
                maxPrice: joi.number()
            });

            const params = {
                pageNo: parseInt(req?.query?.pageNo),
                limit: parseInt(req?.query?.limit),
                searchQuery: req?.query?.searchQuery,
                categoryId: req?.query?.categoryId,
                minPrice: req?.query?.minPrice,
                maxPrice: req?.query?.maxPrice
            }

            await schema.validateAsync(params);

            req.query = {
                ...params
            }
            next();
        } catch (err) {
            console.log(err, 'getPaginatedProductsValidationError');
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
            const categoryId = req?.query?.categoryId;
            const minPrice = req?.query?.minPrice ? parseInt(req?.query?.minPrice) : null;
            const maxPrice = req?.query?.maxPrice ? parseInt(req?.query?.maxPrice) : null;

            console.log(searchQuery, 'searchQuery');

            const filters = {};

            if (categoryId) {
                filters["categoryId"] = categoryId;
            }

            if (minPrice || maxPrice) {
                const typeOfMinPrice = typeof minPrice;
                const typeOfMaxPrice = typeof maxPrice;

                if (typeOfMinPrice === 'number' && typeOfMaxPrice === 'number') {
                    if (!filters["$and"]) filters["$and"] = [];
                    
                    filters["$and"].push({
                        price: {
                            $gte: minPrice
                        }
                    });

                    filters["$and"].push({
                        price: {
                            $lte: maxPrice
                        }
                    });
                } else if (typeOfMinPrice === 'number') {
                    filters["price"] = {
                        $gte: minPrice
                    }
                } else if (typeOfMaxPrice === 'number') {
                    filters["price"] = {
                        $lte: maxPrice
                    }
                }
            }

            const fetchedProductsFromDB = await global?.models?.PRODUCT.find(
                {
                    name: {
                        $regex: searchQuery || ''
                    },
                    ...filters
                }
            )?.skip((pageNo - 1) * limit)?.limit(limit);

            if (fetchedProductsFromDB) {
                res?.status(200)?.json({
                    payload: {
                        products: fetchedProductsFromDB
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
    getPaginatedProductsController
}