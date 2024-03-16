const express = require('express');

const { verifyJWTMiddleware } = require('../middlewares/verifyJWTMiddleware');

const { updateProductsInCartController } = require('../controllers/Cart/updateProductsInCart');

const cartRoutes = express.Router();

cartRoutes.put(`/updateProducts`, 
    (req, res, next) => { 
        verifyJWTMiddleware(req, res, next, (payload) => {
            req.user = payload;
            console.log(payload, 'payload');
        });
    },
    updateProductsInCartController?.validation,
    updateProductsInCartController?.handler
);

module.exports = {
    cartRoutes
}