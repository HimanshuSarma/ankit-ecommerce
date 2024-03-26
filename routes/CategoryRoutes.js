const express = require('express');

const { verifyAllAdminMiddleware } = require('../middlewares/verifyAllAdminMiddleware');

const { createCategoryController } = require('../controllers/Category/createCategory');
const { getCategoryController } = require('../controllers/Category/getCategory');
const { getPaginatedCategoriesController } = require('../controllers/Category/getPaginatedCategories');
const { updateCategoryController } = require('../controllers/Category/updateCategory');
const { deleteCategoryController } = require('../controllers/Category/deleteCategory');

const categoryRoutes = express.Router();

// All POST routes start...
categoryRoutes.post(`/create`, 
    verifyAllAdminMiddleware,
    createCategoryController?.validation,
    createCategoryController?.handler
);
// All POST routes end...

// All GET routes start...
categoryRoutes.get(`/`,
    getCategoryController.validation,
    getCategoryController.handler
);

categoryRoutes.get(`/paginated`, 
    getPaginatedCategoriesController.validation,
    getPaginatedCategoriesController.handler
);
// All GET routes end...

// All PUT routes start...
categoryRoutes.put(`/`, 
    verifyAllAdminMiddleware,
    updateCategoryController.validation,
    updateCategoryController.handler
);
// All PUT routes end...

// All DELETE routes start...
categoryRoutes.delete(`/`, 
    verifyAllAdminMiddleware,
    deleteCategoryController?.validation,
    deleteCategoryController?.handler
);
// All DELETE routes end...

module.exports = {
    categoryRoutes
}