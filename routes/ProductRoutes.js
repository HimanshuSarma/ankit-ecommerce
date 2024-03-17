const express = require('express');

const { verifyAllAdminMiddleware } = require('../middlewares/verifyAllAdminMiddleware');

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
    verifyAllAdminMiddleware,
    async (req, res, next) => {
        const result = await uploadMultipleImagesFromBodyMiddleware(req);
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
    checkPhoneNumberVerificationHandler,
    getProductController.validation,
    getProductController.handler
);

productRoutes.get(`/paginated`,
    checkPhoneNumberVerificationHandler,
    getPaginatedProductsController.validation,
    getPaginatedProductsController.handler
);
// All GET routes end...

// All DELETE routes start...
productRoutes.delete(`/`, 
    verifyAllAdminMiddleware,
    deleteProductController.validation,
    deleteProductController.handler
)
// All DELETE routes end...

module.exports = {
    productRoutes
}