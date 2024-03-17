const express = require('express');

const { verifyCustomerMiddleware } = require('../middlewares/verifyCustomerMiddleware');

const { updateProductsInCartController } = require('../controllers/Cart/updateProductsInCart');

const cartRoutes = express.Router();

cartRoutes.put(`/updateProducts`, 
    verifyCustomerMiddleware,
    updateProductsInCartController?.validation,
    updateProductsInCartController?.handler
);

module.exports = {
    cartRoutes
}