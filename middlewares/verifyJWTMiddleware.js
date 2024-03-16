const { verifyJWTTokenHandler } = require('../utils/Auth/verifyJWTTokenHandler');

const { responseErrorMessages } = require('../staticData/responseErrorMessages');

const verifyJWTMiddleware = (req, res, next, attachPayloadCb) => {
    if (typeof req === 'string') {
    // If req is string, then, it means 'req' argument is the token itself,
    // and not the express Request object...

        // 'payload' will either be null or a valid value
        const payload = verifyJWTTokenHandler({
            token: req
        });

        return payload;
    } else {
        const token = req?.headers?.authorization?.split?.(' ')?.[1];

        // 'payload' will either be null or a valid value
        const payload = verifyJWTTokenHandler({
            token
        });

        if (payload) {
            attachPayloadCb ? attachPayloadCb(payload) : null;
            next();
        } else {
            res?.status(500)?.json({
                errorMessage: responseErrorMessages?.INVALID_AUTH_TOKEN
            })
        }
    }
};

module.exports = {
    verifyJWTMiddleware
}