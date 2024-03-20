const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const adminLoginController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                email: joi.string().email({ tlds: { allow: false } }).required(),
                password: joi.string().required()
            });
    
            const reqPayload = req?.body;
    
            await schema.validateAsync({
                email: reqPayload?.email,
                password: reqPayload?.password
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

            const fetchedAdminFromDB = await global?.models?.ADMIN?.findOne(
                { email: reqPayload?.email }
            );

            const fetchedAdminDoc = fetchedAdminFromDB?.leanDoc();

            if (fetchedAdminFromDB?._id) {
                const passwordMatch = await bcrypt.compare(reqPayload?.password, fetchedAdminFromDB?.password);
                if (passwordMatch) {
                    const token = jwt.sign(fetchedAdminDoc, process.env.JWT_SECRET);

                    res?.status(200)?.json({
                        payload: {
                            token
                        },
                        message: responseErrorMessages?.SUCCESS
                    })
                } else {
                    res?.status(400).json({
                        errorMessage: responseErrorMessages?.PASSWORD_DOESNOT_MATCH
                    });
                }
            } else {
                throw new Error(`Some error occured`);
            }
        } catch (err) {
            console.log(err, 'admin login error');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    adminLoginController
};