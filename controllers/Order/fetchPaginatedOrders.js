const mongoose = require('mongoose');
const joi = require('joi');

const fetchPaginatedOrdersController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                limit: joi.number().min(1).required(),
                pageNo: joi.number().min(1).required(),
            });

            const reqQueryParams = req?.query;

            await schema?.validateAsync(reqQueryParams);
            next();
        } catch (err) {
            res?.status(400).json({
                errorMessage: err?.message
            });
        }
    },
    handler: async (req, res, next) => {
        try {

            const reqQueryParams = req?.query; 
            const customer = req?.customer

            const fetchedPaginatedOrdersInDB = await global?.models?.ORDER?.find(
                {
                    "cart.userId": new mongoose.Types.ObjectId(customer?._id)
                }
            )?.skip((reqQueryParams?.pageNo - 1) * reqQueryParams?.limit)?.limit(reqQueryParams?.limit);

            res?.status(200)?.json({
                payload: {
                    orders: fetchedPaginatedOrdersInDB
                }
            })
        } catch (err) {
            console.log(err, 'error');
            res?.status(500).json({
                errorMessage: err?.message || err?.errorMessage
            });
        }
    }
};

module.exports = {
    fetchPaginatedOrdersController
}