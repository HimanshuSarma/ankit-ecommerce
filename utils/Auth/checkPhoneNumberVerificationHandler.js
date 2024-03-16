const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const checkPhoneNumberVerificationHandler = (req, res, next) => {
    const user = req?.user || req?.admin;

    if (user?.isPhoneNumberVerified) {
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