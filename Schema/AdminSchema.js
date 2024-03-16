const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.String },
    phoneNumber: { type: mongoose.Schema.Types.String, required: true },
    phoneVerificationOtp: { type: mongoose.Schema.Types.String, default: null, required: true },
    isPhoneNumberVerified: { type: mongoose.Schema.Types.Boolean, required: true, default: false },
    email: { type: mongoose.Schema.Types.String, required: true, unique: true },
    password: { type: mongoose.Schema.Types.String, required: true },
    userType: { type: mongoose.Schema.Types.String, enum: ['Admin', 'Superadmin'], required: true, default: 'Admin' },
}, { timestamps: true });

AdminSchema.methods.leanDoc = function () {
    const doc = this._doc;
    const { password, ...rest } = doc;
    return rest;
};

module.exports = {
    AdminSchema,
}