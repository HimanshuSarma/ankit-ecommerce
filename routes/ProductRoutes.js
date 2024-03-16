const express = require('express');

const { verifyJWTMiddleware } = require('../middlewares/verifyJWTMiddleware');

const { createProductController } = require('../controllers/Product/createProduct');
const { getProductController } = require('../controllers/Product/getProduct');
const { getPaginatedProductsController } = require('../controllers/Product/getPaginatedProducts');
const { deleteProductController } = require('../controllers/Product/deleteProduct');
const { checkPhoneNumberVerificationHandler } = require('../utils/Auth/checkPhoneNumberVerificationHandler');
const { uploadImageMiddleware, uploadImage } = require('../utils/aws/s3Upload');

const productRoutes = express.Router();

// All POST routes start...
productRoutes.post(`/create`, 
    (req, res, next) => { 
        verifyJWTMiddleware(req, res, next, (payload) => {
            req.admin = payload;
        });
    },
    uploadImage?.single('img'),
    async (req, res, next) => {
        // await uploadMediaFile({
        //     content: 'ABC',
        //     contentType: 'text/plain',
        //     key: 'file'
        // });
        // console.log(req?.file, 'files');
        // await uploadImage({
        //     content: req?.files?.img,
        //     contentType: 'text/plain',
        //     key: 'testfile123image'
        //     // file: req?.files?.img
        // });

        // uploadImage?.single('img')
        uploadImageMiddleware(req, res, next);
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