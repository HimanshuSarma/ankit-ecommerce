const axios = require('axios').default;
const { otpGen } = require('otp-gen-agent');

const sendPhoneVerificationOTPHandler = async ({
    phoneNumber,
    newOtp
}) => {
    try {
        const fastApiURL = process.env.FAST_API;
        const otp = newOtp || await otpGen();
        const res = await axios.get(`${fastApiURL}`, {
            params: {
                authorization: process.env.FAST_API_AUTHORIZATION_TOKEN,
                route: 'otp',
                variables_values: otp,
                flash: 0,
                numbers: phoneNumber
            }
        });

        return {
            ...res,
            success: res?.return
        };
    } catch (err) {
        console.log(err?.response?.data, 'sendPhoneVerificationOTPHandlerError');
        return {
            success: false,
            errorMessage: err?.response?.data?.message
        };
    }  
};

module.exports = {
    sendPhoneVerificationOTPHandler
}