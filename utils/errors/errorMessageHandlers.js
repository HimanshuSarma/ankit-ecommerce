const { responseErrorMessages } = require('../../staticData/responseErrorMessages');

const resourceNotFoundErrorMessage = ({
    resouce
}) => {
    return responseErrorMessages?.RESOURCE_NOT_FOUND + resouce
};

module.exports = {
    resourceNotFoundErrorMessage
}