const express = require('express');

const { verifyCustomerMiddleware } = require('../../../middlewares/verifyCustomerMiddleware');

const { incrementViewCountController } = require('../../../controllers/Analytics/UserViewedProduct/incrementViewCountController');

const analyticsUserViewedProductRoutes = express.Router();

analyticsUserViewedProductRoutes.put(`/increment`, 
    verifyCustomerMiddleware,
    incrementViewCountController?.validation,
    incrementViewCountController?.handler
);

module.exports = {
    analyticsUserViewedProductRoutes
}