const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');
const { default: mongoose } = require('mongoose');

const deleteCategoryController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                categoryId: joi.string().min(12).required(),
            });
    
            const reqPayload = req?.query;
    
            await schema.validateAsync({
                categoryId: reqPayload?.categoryId,
            });

            next();
        } catch (err) {
            console.log(err, 'deleteCategoryValidationError');
            res?.status(400).json({
                errorMessage: err?.message
            });
        }
        
    },
    handler: async (req, res, next) => {

        const dbSession = await global.dbConnection?.startSession();
        dbSession?.startTransaction({
            readConcern: {
                level: 'majority'
            },
            writeConcern: {
                level: 'majority'
            }
        });

        try {

            const reqPayload = req?.query;
            const admin = req?.admin;

            const deletedCategoryInDB = await global?.models?.CATEGORY?.deleteOne(
                { 
                    _id: new mongoose.Types.ObjectId(reqPayload?.categoryId),
                    createdBy: new mongoose.Types.ObjectId(admin?._id)
                },
            )?.session(dbSession);

            let deletedProductsInDB;

            if (deletedCategoryInDB?.deletedCount === 1) {
                deletedProductsInDB = await global?.models?.PRODUCT?.deleteMany(
                    { categoryId: new mongoose.Types.ObjectId(reqPayload?.categoryId) }
                )?.session(dbSession);
            }

            if (deletedCategoryInDB?.deletedCount === 1 && deletedProductsInDB?.deletedCount >= 0) {
                await dbSession?.commitTransaction();
                res?.status(200)?.json({
                    message: responseErrorMessages?.SUCCESS
                })
            } else {
                throw new Error(`Some error occured`);
            }
        } catch (err) {
            console.log(err, 'deleteCategoryHandlerError');
            await dbSession?.abortTransaction();
            res?.status(500).json({
                errorMessage: err?.message
            });
        } finally {
            await dbSession?.endSession();
        }
    }
};

module.exports = {
    deleteCategoryController
};