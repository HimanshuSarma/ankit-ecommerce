const { extractJWTTokenPayloadHandler } = require('./extractJWTTokenPayloadHandler');

const { responseErrorMessages } = require('../staticData/responseErrorMessages');

const verifySuperadminMiddleware = (req, res, next) => {
    const jwtTokenPayload = extractJWTTokenPayloadHandler(req);

    if (jwtTokenPayload?.userType === 'Superadmin') {
        req.superadmin = jwtTokenPayload;
        next();
    } else {
        res?.status(400)?.json({
            errorMessage: responseErrorMessages?.ONLY_SUPERADMIN_ACCESS
        });
    }
};

module.exports = {
    verifySuperadminMiddleware
}