const responseErrorMessages = {
    SUCCESS: `Successful!`,
    OTP_SENT_SUCCESSFULLY: 'OTP sent successfully',
    PHONE_OTP_VERIFICATION_SUCCESSFUL: `Phone Number verification successful!`,
    RESOURCE_CREATED_SUCCESSFULLY: `The following resource was created successfully: `,

    PHONE_NUMBER_VERIFICATION_REQUIRED: `Phone Number verification is required!`,

    INVALID_AUTH_TOKEN: `The auth token is invalid`,
    INVALID_REQUEST: `Invalid request`,
    PASSWORD_DOESNOT_MATCH: `Password doesn't match`,

    SOME_ERROR_OCCURED: `Some error occured!`,
    ERROR_UPLOADING_IMAGES: `Some error occured in uploading the images. Please try again!`,
    RESOURCE_NOT_FOUND: `The following resource was not found: `,

    ONLY_SUPERADMIN_ACCESS: `Only superadmins can perform this action!`,
    ONLY_ADMIN_ACCESS: `Only Admins can perform this action!`,
    ONLY_CUSTOMER_ACCESS: `Only Customers can perform this action!`,
};

module.exports = {
    responseErrorMessages
}