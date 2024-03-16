const express = require('express');

const indexRouter = express.Router();

const { categoryRoutes } = require('./CategoryRoutes');
const { productRoutes } = require('./ProductRoutes');
const { cartRoutes } = require('./CartRoutes');
const { orderRoutes } = require('./OrderRoutes');
const { customerRoutes } = require('./CustomerRoutes');
const { adminRoutes } = require('./AdminRoutes');
const { analyticsIndexRoutes } = require('./Analytics/analyticsIndexRoutes');


indexRouter.use(`/admin`, adminRoutes);
indexRouter.use(`/customer`, customerRoutes);
indexRouter.use(`/category`, categoryRoutes);
indexRouter.use(`/product`, productRoutes);
indexRouter.use(`/cart`, cartRoutes);
indexRouter.use(`/order`, orderRoutes);
indexRouter.use(`/analytics`, analyticsIndexRoutes);

module.exports = {
    indexRouter
};

