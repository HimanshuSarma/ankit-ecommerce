const { verifyJWTTokenHandler } = require('./verifyJWTTokenHandler');
const { extractJWTTokenPayloadHandler } = require('../../middlewares/extractJWTTokenPayloadHandler')

const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const checkPhoneNumberVerificationHandler = (req, res, next) => {

    const jwtPayload = extractJWTTokenPayloadHandler(req);

    if (jwtPayload?.isPhoneNumberVerified) {
        next();
    } else {
        res?.status(401)?.json({
            errorMessage: responseErrorMessages?.PHONE_NUMBER_VERIFICATION_REQUIRED
        })
    }
}

module.exports = {
    checkPhoneNumberVerificationHandler
}