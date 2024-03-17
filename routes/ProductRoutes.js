const express = require('express');

const { verifyJWTMiddleware } = require('../middlewares/verifyJWTMiddleware');

const { createProductController } = require('../controllers/Product/createProduct');
const { getProductController } = require('../controllers/Product/getProduct');
const { getPaginatedProductsController } = require('../controllers/Product/getPaginatedProducts');
const { deleteProductController } = require('../controllers/Product/deleteProduct');
const { checkPhoneNumberVerificationHandler } = require('../utils/Auth/checkPhoneNumberVerificationHandler');
const { multerUploadImageHandler } = require('../utils/images/multerUploadFilesHandler');
const { uploadMultipleImagesFromBodyMiddleware } = require('../utils/images/uploadImageHandlers');

const { responseErrorMessages } = require('../staticData/responseErrorMessages');

const productRoutes = express.Router();

// All POST routes start...
productRoutes.post(`/create`, 
    (req, res, next) => { 
        verifyJWTMiddleware(req, res, next, (payload) => {
            req.admin = payload;
        });
    },
    async (req, res, next) => {
        const result = await uploadMultipleImagesFromBodyMiddleware(req, res, next);
        if (result || !req?.body?.images) {
            next();
        } else {    
            res?.status(500)?.json({
                errorMessage: responseErrorMessages?.ERROR_UPLOADING_IMAGES
            })
        }
    },
    createProductController?.validation,
    createProductController?.handler
);
// All POST routes end...

// All GET routes start...
productRoutes.get(`/`, 
    (req, res, next) => { 
        verifyJWTMiddleware(req, res, next, (payload) => {
            req.user = payload;
        });
    },
    checkPhoneNumberVerificationHandler,
    getProductController.validation,
    getProductController.handler
);

productRoutes.get(`/paginated`, 
    (req, res, next) => { 
        verifyJWTMiddleware(req, res, next, (payload) => {
            req.user = payload;
        });
    },
    checkPhoneNumberVerificationHandler,
    getPaginatedProductsController.validation,
    getPaginatedProductsController.handler
);
// All GET routes end...

// All DELETE routes start...
productRoutes.delete(`/`, 
    (req, res, next) => { 
        verifyJWTMiddleware(req, res, next, (payload) => {
            req.admin = payload;
        });
    },
    deleteProductController.validation,
    deleteProductController.handler
)
// All DELETE routes end...

module.exports = {
    productRoutes
}