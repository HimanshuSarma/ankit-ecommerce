const { extractJWTTokenPayloadHandler } = require('./extractJWTTokenPayloadHandler');

const { responseErrorMessages } = require('../staticData/responseErrorMessages');

const verifyCustomerMiddleware = (req, res, next) => {
    extractJWTTokenPayloadHandler(req, (payload) => {
        if (payload?.userType === 'customer') {
            req.customer = payload;
            next();
        } else {
            res?.status(400)?.json({
                errorMessage: responseErrorMessages?.ONLY_CUSTOMER_ACCESS
            });
        }
    });
};

module.exports = {
    verifyCustomerMiddleware
}