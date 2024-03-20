const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const createCartController = {
    handler: async (req, res, next) => {
        try {
            const customer = req?.customer;

            const newCart = {
                products: [],
                customerId: customer?._id
            }

            const newCartInDB = await global?.models?.CART?.create(
                newCart
            );

            if (newCartInDB?._id) {
                res?.status(200)?.json({
                    payload: {
                        cart: newCartInDB
                    }
                });
            } else {
                throw new Error(responseErrorMessages?.SOME_ERROR_OCCURED);
            }
        } catch (err) {
            console.log(err, 'create cart error');
            res?.status(500).json({
                errorMessage: err?.message || err?.errorMessage
            });
        }
    }
};

module.exports = {
    createCartController
}