const bcrypt = require('bcrypt');

const passwordHashHandler = async ({
    password
}) => {
    if (!process.env.PASSWORD_HASH_SALT_ROUNDS) {
        throw new Error(`Salt rounds isn't set in env variables`);
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

module.exports = {
    passwordHashHandler
}