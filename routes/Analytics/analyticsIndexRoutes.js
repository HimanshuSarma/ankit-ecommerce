const express = require('express');

const { analyticsUserViewedProductRoutes } = require('./UserViewedProduct/AnalyticsUserViewedProductRoutes')

const analyticsIndexRoutes = express.Router();

analyticsIndexRoutes.use(`/userViewedProduct`, analyticsUserViewedProductRoutes);

module.exports = {
    analyticsIndexRoutes
}