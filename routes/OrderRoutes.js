const express = require('express');

const { verifyCustomerMiddleware } = require('../middlewares/verifyCustomerMiddleware');
const { verifySuperadminMiddleware } = require('../middlewares/verifySuperadminMiddleware');

const { createOrderController } = require('../controllers/Order/createOrder');
const { placeOrderController } = require('../controllers/Order/placeOrder');
const { fetchPaginatedOrdersController } = require('../controllers/Order/fetchPaginatedOrders');

const { checkPhoneNumberVerificationHandler } = require('../utils/Auth/checkPhoneNumberVerificationHandler');

const orderRoutes = express.Router();

// All POST routes start...
orderRoutes.post(`/create-order`, 
    verifyCustomerMiddleware,
    checkPhoneNumberVerificationHandler,
    createOrderController?.handler
);
// All POST routes end...

// All PUT routes start...
orderRoutes.put(`/place-order`, 
    verifySuperadminMiddleware,
    checkPhoneNumberVerificationHandler,
    placeOrderController.validation,
    placeOrderController.handler
);
// All PUT routes end...

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

orderRoutes.get(`/paginated`, 
    verifyCustomerMiddleware,
    fetchPaginatedOrdersController.validation,
    fetchPaginatedOrdersController.handler
);
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