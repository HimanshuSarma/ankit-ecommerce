const express = require('express');

const { verifyCustomerMiddleware } = require('../middlewares/verifyCustomerMiddleware');

const { createOrderController } = require('../controllers/Order/createOrder');

const { checkPhoneNumberVerificationHandler } = require('../utils/Auth/checkPhoneNumberVerificationHandler');

const orderRoutes = express.Router();

// All POST routes start...
orderRoutes.post(`/place-order`, 
    verifyCustomerMiddleware,
    checkPhoneNumberVerificationHandler,
    createOrderController?.handler
);
// All POST routes end...

// All GET routes start...
// orderRoutes.get(`/`, 
//     (req, res, next) => { 
//         verifyJWTMiddleware(req, res, next, (payload) => {
//             req.admin = payload;
//         });
//     },
//     getProductController.validation,
//     getProductController.handler
// );

// orderRoutes.get(`/paginated`, 
//     (req, res, next) => { 
//         verifyJWTMiddleware(req, res, next, (payload) => {
//             req.admin = payload;
//         });
//     },
//     getPaginatedProductsController.validation,
//     getPaginatedProductsController.handler
// );
// All GET routes end...

// All DELETE routes start...
// orderRoutes.delete(`/`, 
//     (req, res, next) => { 
//         verifyJWTMiddleware(req, res, next, (payload) => {
//             req.admin = payload;
//         });
//     },
//     deleteProductController.validation,
//     deleteProductController.handler
// )
// All DELETE routes end...

module.exports = {
    orderRoutes
}