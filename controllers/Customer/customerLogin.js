const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');

const { responseErrorMessages } = require('../../staticData/responseErrorMessages')

const customerLoginController = {
    validation: async (req, res, next) => {
        try {
            const schema = joi.object({
                email: joi.string().email({ tlds: { allow: false } }).required(),
                password: joi.string().required()
            });

            await schema.validateAsync(req?.body);
            next();
        } catch (err) {
            res?.status(400).json({
                errorMessage: err?.message
            });
        }
    },
    handler: async (req, res, next) => {
        try {

            const reqPayload = req?.body;

            const fetchedCustomerFromDB = await global?.models?.CUSTOMER?.findOne(
                { email: reqPayload?.email }
            );

            const fetchedCustomerDoc = fetchedCustomerFromDB?.leanDoc();

            const passwordMatch = await bcrypt.compare(reqPayload?.password, fetchedCustomerFromDB?.password);
            if (passwordMatch) {
                const token = jwt.sign(fetchedCustomerDoc, process.env.JWT_SECRET);

                res?.status(200)?.json({
                    payload: {
                        item: {
                            user: fetchedCustomerDoc,
                            token
                        }
                    },
                    message: responseErrorMessages?.SUCCESS
                })
            } else {
                res?.status(400).json({
                    errorMessage: responseErrorMessages?.PASSWORD_DOESNOT_MATCH
                });
            }
        } catch (err) {
            console.log(err, 'customer login error');
            res?.status(500).json({
                errorMessage: err?.message
            });
        }
    }
};

module.exports = {
    customerLoginController
}