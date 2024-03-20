const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');

const { passwordHashHandler } = require('../../utils/Auth/passwordHash');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const adminCreateController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                name: joi.string(),
                email: joi.string().email({ tlds: { allow: false } }).required(),
                password: joi.string().required(),
                userType: joi.string().valid('Admin').required(),
                adminEmail: joi.string().email({ tlds: { allow: false } }).required(),
                adminPassword: joi.string().required()
            });
    
            const reqPayload = req?.body;
    
            await schema.validateAsync({
                name: reqPayload?.name,
                email: reqPayload?.email,
                password: reqPayload?.password,
                userType: reqPayload?.userType,
                adminEmail: reqPayload?.adminEmail,
                adminPassword: reqPayload?.adminPassword
            });

            next();
        } catch (err) {
            res?.status(400).json({
                errorMessage: err?.message
            });
        }
        
    },
    handler: async (req, res, next) => {
        try {

            console.log('admin login handler', req?.body?.email);

            const reqPayload = req?.body;

            let newAdmin;
            const fetchedAdminRequestorFromDB = await global?.models?.ADMIN?.findOne(
                { email: reqPayload?.adminEmail }
            );

            if (fetchedAdminRequestorFromDB?._id) {
                const isPasswordMatched = await bcrypt?.compare(reqPayload?.password, fetchedAdminRequestorFromDB?.password);

                if (isPasswordMatched) {
                    newAdmin = {
                        name: reqPayload?.name,
                        email: reqPayload?.email,
                        password: await passwordHashHandler({ password: reqPayload?.password }),
                        userType: reqPayload?.userType
                    };

                    const newAdminInDB = await global?.models?.ADMIN?.create(
                        newAdmin
                    );

                    if (newAdminInDB?._id) {
                        res?.status(200)?.json({
                            payload: {
                                admin: newAdminInDB
                            },
                            message: responseErrorMessages?.SUCCESS
                        }) 
                    } else {
                        throw new Error(newAdminInDB);
                    }
                } else {
                    res?.status(500).json({
                        errorMessage: `The admin requestor password doesn't match!`
                    });
                }
            } else {
                res?.status(500).json({
                    errorMessage: `The admin requestor account doesn't exist!`
                });
            }
        } catch (err) {
            console.log(err, 'admin login error');
            res?.status(500).json({
                errorMessage: err?.message || `Some error occured!`
            });
        }
    }
};

module.exports = {
    adminCreateController
};