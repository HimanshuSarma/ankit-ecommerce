const express = require('express');

const { verifyCustomerMiddleware } = require('../middlewares/verifyCustomerMiddleware');

const { createCartController } = require('../controllers/Cart/createCart');
const { updateProductsInCartController } = require('../controllers/Cart/updateProductsInCart');
const { fetchCartByCustomerIdController } = require('../controllers/Cart/fetchCartControllers');

const cartRoutes = express.Router();

// All POST routes start...
cartRoutes.post(`/`, 
    verifyCustomerMiddleware,
    createCartController.handler
);
// All POST routes end...

// All PUT routes start...
cartRoutes.put(`/updateProducts`, 
    verifyCustomerMiddleware,
    updateProductsInCartController?.validation,
    updateProductsInCartController?.handler
);
// All PUT routes end...

// All GET routes start...
cartRoutes.get(`/`, 
    verifyCustomerMiddleware,
    fetchCartByCustomerIdController.handler
);
// All GET routes end...

module.exports = {
    cartRoutes
}