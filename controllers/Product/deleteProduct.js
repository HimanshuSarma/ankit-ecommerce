const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');
const { default: mongoose } = require('mongoose');

const deleteProductController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                productId: joi.string().min(12).required(),
            });
    
            const reqPayload = req?.query;
    
            await schema.validateAsync({
                productId: reqPayload?.productId,
            });

            next();
        } catch (err) {
            console.log(err, 'deleteProductValidationError');
            res?.status(400).json({
                errorMessage: err?.message
            });
        }
        
    },
    handler: async (req, res, next) => {

        try {

            const reqPayload = req?.query;
            const admin = req?.admin;

            const deletedProductInDB = await global?.models?.CATEGORY?.deleteOne(
                { 
                    _id: new mongoose.Types.ObjectId(reqPayload?.productId),
                    createdBy: new mongoose.Types.ObjectId(admin?._id)
                },
            );

            if (deletedProductInDB?.deletedCount === 1) {
                res?.status(200)?.json({
                    message: responseErrorMessages?.SUCCESS
                })
            } else {
                throw new Error(`Some error occured`);
            }
        } catch (err) {
            console.log(err, 'deleteCategoryHandlerError');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    deleteProductController
};