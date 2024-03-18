const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    // name: { type: mongoose.Schema.Types.String },
    // email: { type: mongoose.Schema.Types.String, required: true, unique: true },
    phoneNumber: { type: mongoose.Schema.Types.String, required: true, unique: true },
    phoneVerificationOtp: { type: mongoose.Schema.Types.String, default: null, required: true },
    isPhoneNumberVerified: { type: mongoose.Schema.Types.Boolean, required: true, default: false },
    userType: { type: mongoose.Schema.Types.String, required: true, default: 'customer', enum: ['customer'] }
    // password: { type: mongoose.Schema.Types.String, required: true },
}, { timestamps: true });


CustomerSchema.methods.leanDoc = function () {
    const doc = this._doc;
    const { password, ...rest } = doc;
    return rest;
};

module.exports = {
    CustomerSchema,
}