const express = require('express');

const { verifyJWTMiddleware } = require('../../../middlewares/verifyJWTMiddleware');

const { incrementViewCountController } = require('../../../controllers/Analytics/UserViewedProduct/incrementViewCountController');

const analyticsUserViewedProductRoutes = express.Router();

analyticsUserViewedProductRoutes.put(`/increment`, 
    (req, res, next) => { 
        verifyJWTMiddleware(req, res, next, (payload) => {
            req.user = payload;
            console.log(payload, 'payload');
        });
    },
    incrementViewCountController?.validation,
    incrementViewCountController?.handler
);

module.exports = {
    analyticsUserViewedProductRoutes
}