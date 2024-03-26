const { extractJWTTokenPayloadHandler } = require('./extractJWTTokenPayloadHandler');

const { responseErrorMessages } = require('../staticData/responseErrorMessages');

const verifyCustomerMiddleware = (req, res, next) => {
    const jwtTokenPayload = extractJWTTokenPayloadHandler(req);

    if (jwtTokenPayload?.userType === 'customer') {
        req.customer = jwtTokenPayload;
        next();
    } else {
        res?.status(400)?.json({
            errorMessage: responseErrorMessages?.ONLY_CUSTOMER_ACCESS
        });
    }
};

module.exports = {
    verifyCustomerMiddleware
}