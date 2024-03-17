const { verifyJWTTokenHandler } = require('../utils/Auth/verifyJWTTokenHandler');

const { responseErrorMessages } = require('../staticData/responseErrorMessages');

const extractJWTTokenPayloadHandler = (req, attachPayloadCb) => {
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
        } else {
            attachPayloadCb ? attachPayloadCb(null) : null;
        }
    }
};

module.exports = {
    extractJWTTokenPayloadHandler
}