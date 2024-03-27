const mongoose = require('mongoose');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const getPaginatedDeliveryPartnersController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                pageNo: joi.number().required(),
                limit: joi.number().required(),
                searchQuery: joi.string(),
                phoneNumber: joi.string(),
            });

            const params = {
                pageNo: parseInt(req?.query?.pageNo),
                limit: parseInt(req?.query?.limit),
                searchQuery: req?.query?.searchQuery,
                phoneNumber: req?.query?.phoneNumber,
            }

            await schema.validateAsync(params);

            req.query = {
                ...params
            }
            next();
        } catch (err) {
            console.log(err, 'getPaginatedDeliveryPartnersValidationError');
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
            const phoneNumber = req?.query?.phoneNumber;

            console.log(req?.query, 'reqQuery');

            const filters = {};

            if (phoneNumber) {
                filters["phoneNumber"] = phoneNumber;
            }

            const fetchedDeliveryPartnersFromDB = await global?.models?.DELIVERY_PARTNER.find(
                {
                    name: {
                        $regex: searchQuery || ''
                    },
                    ...filters
                }
            )?.skip((pageNo - 1) * limit)?.limit(limit);

            if (fetchedDeliveryPartnersFromDB) {
                res?.status(200)?.json({
                    payload: {
                        deliveryPartners: fetchedDeliveryPartnersFromDB
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
    getPaginatedDeliveryPartnersController
}