const express = require('express');

const { verifyJWTMiddleware } = require('../middlewares/verifyJWTMiddleware');

const { createCategoryController } = require('../controllers/Category/createCategory');
const { deleteCategoryController } = require('../controllers/Category/deleteCategory');

const categoryRoutes = express.Router();

categoryRoutes.post(`/create`, 
    (req, res, next) => { 
        verifyJWTMiddleware(req, res, next, (payload) => {
            req.admin = payload;
            console.log(payload, 'payload');
        });
    },
    createCategoryController?.validation,
    createCategoryController?.handler
);

categoryRoutes.delete(`/`, 
    (req, res, next) => { 
        verifyJWTMiddleware(req, res, next, (payload) => {
            req.admin = payload;
            console.log(payload, 'payload');
        });
    },
    deleteCategoryController?.validation,
    deleteCategoryController?.handler
);

module.exports = {
    categoryRoutes
}