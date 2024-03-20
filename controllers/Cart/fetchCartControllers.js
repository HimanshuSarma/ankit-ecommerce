const joi = require('joi');
const mongoose = require('mongoose');

const fetchCartByCustomerIdController = {
    handler: async (req, res, next) => {
        try {
            const customer = req?.customer;

            const fetchedCartFromDB = await global?.models?.CART?.findOne(
                { "customerId": new mongoose.Types.ObjectId(customer?._id) }
            );

            res?.status(200)?.json({
                payload: {
                    cart: fetchedCartFromDB
                }
            });
        } catch (err) {
            console.log(err, 'fetchCartByCustomerIdControllerError');
            res?.status(500).json({
                errorMessage: err?.message || err?.errorMessage
            });
        }
    }
};

module.exports = {
    fetchCartByCustomerIdController
}