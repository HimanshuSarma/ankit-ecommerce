const { extractJWTTokenPayloadHandler } = require('./extractJWTTokenPayloadHandler');

const { responseErrorMessages } = require('../staticData/responseErrorMessages');

const verifySuperadminMiddleware = (req, res, next) => {
    extractJWTTokenPayloadHandler(req, (payload) => {
        if (payload?.userType === 'Superadmin') {
            req.superadmin = payload;
            next();
        } else {
            res?.status(400)?.json({
                errorMessage: responseErrorMessages?.ONLY_SUPERADMIN_ACCESS
            });
        }
    });
};

module.exports = {
    verifySuperadminMiddleware
}