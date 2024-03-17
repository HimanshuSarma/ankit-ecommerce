const { extractJWTTokenPayloadHandler } = require('./extractJWTTokenPayloadHandler');

const { responseErrorMessages } = require('../staticData/responseErrorMessages');

const verifyAllAdminMiddleware = (req, res, next) => {
    extractJWTTokenPayloadHandler(req, (payload) => {
        if (payload?.userType === 'Superadmin' || payload?.userType === 'Admin') {
            req.admin = payload;
            next();
        } else {
            res?.status(400)?.json({
                errorMessage: responseErrorMessages?.ONLY_ADMIN_ACCESS
            });
        }
    });
};

module.exports = {
    verifyAllAdminMiddleware
}