const bcrypt = require('bcrypt');
const joi = require('joi');

const { passwordHashHandler } = require('../../utils/Auth/passwordHash');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const customerSignupController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                name: joi.string().required(),
                email: joi.string().email({ tlds: { allow: false } }).required(),
                password: joi.string().required(),
            });
    
            const reqPayload = req?.body;

            await schema.validateAsync({
                name: reqPayload?.name,
                email: reqPayload?.email,
                password: reqPayload?.password,
            });

            next();
        } catch (err) {
            console.log(err, 'customerSignupValidationError');
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

            const reqPayload = req?.body;

            const newCustomer = {
                name: reqPayload?.name,
                email: reqPayload?.email,
                password: await passwordHashHandler({
                    password: reqPayload?.password
                }),
            };

            const newCustomerInDB = await global?.models?.CUSTOMER?.create(
                newCustomer,
                { session: dbSession }
            );

            const customerCart = {
                products: [],
                userId: newCustomerInDB?._id
            };

            const customerCartInDB = await global?.models?.CART?.create(
                customerCart,
                { session: dbSession }
            );

            if (newCustomerInDB?._id && customerCartInDB?._id) {
                await dbSession?.commitTransaction();
                res?.status(200)?.json({
                    payload: {
                        item: newCustomerInDB
                    },
                    message: responseErrorMessages?.SUCCESS
                })
            } else {
                throw new Error(`Some error occured`);
            }
        } catch (err) {
            console.log(err, 'customerSignupHandlerError');
            await dbSession?.abortTransaction();
            res?.status(500).json({
                errorMessage: err?.message
            });
        } finally {
            console.log('session ended');
            await dbSession?.endSession();
        }
    }
};

module.exports = {
    customerSignupController
};