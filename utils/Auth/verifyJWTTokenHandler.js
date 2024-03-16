const jwt = require('jsonwebtoken');

const verifyJWTTokenHandler = ({
    token
}) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
};  

module.exports = {
    verifyJWTTokenHandler
}