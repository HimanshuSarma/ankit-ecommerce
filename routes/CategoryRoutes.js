const express = require('express');

const { verifyAllAdminMiddleware } = require('../middlewares/verifyAllAdminMiddleware');

const { createCategoryController } = require('../controllers/Category/createCategory');
const { deleteCategoryController } = require('../controllers/Category/deleteCategory');

const categoryRoutes = express.Router();

categoryRoutes.post(`/create`, 
    verifyAllAdminMiddleware,
    createCategoryController?.validation,
    createCategoryController?.handler
);

categoryRoutes.delete(`/`, 
    verifyAllAdminMiddleware,
    deleteCategoryController?.validation,
    deleteCategoryController?.handler
);

module.exports = {
    categoryRoutes
}