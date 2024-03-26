const { extractJWTTokenPayloadHandler } = require('./extractJWTTokenPayloadHandler');

const { responseErrorMessages } = require('../staticData/responseErrorMessages');

const verifyAllAdminMiddleware = (req, res, next) => {
    const jwtTokenPayload = extractJWTTokenPayloadHandler(req);

    if (jwtTokenPayload?.userType === 'Superadmin' || jwtTokenPayload?.userType === 'Admin') {
        req.admin = jwtTokenPayload;
        next();
    } else {
        res?.status(400)?.json({
            errorMessage: responseErrorMessages?.ONLY_ADMIN_ACCESS
        });
    }
};

module.exports = {
    verifyAllAdminMiddleware
}