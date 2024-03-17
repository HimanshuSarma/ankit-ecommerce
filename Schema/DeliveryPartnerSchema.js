const mongoose = require('mongoose');

const DeliveryPartnerSchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true },
    phoneNumber: { type: mongoose.Schema.Types.String, required: true, unique: true },
    phoneVerificationOtp: { type: mongoose.Schema.Types.String, default: 'null', required: true },
    isPhoneNumberVerified: { type: mongoose.Schema.Types.Boolean, default: false, required: true },
}, { timestamps: true });

module.exports = {
    DeliveryPartnerSchema
}