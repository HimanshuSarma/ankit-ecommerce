const mongoose = require('mongoose');

const AnalyticsUserViewedProductSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    count: { type: mongoose.Schema.Types.Number, default: 0, required: true }
}, { timestamps: true });

AnalyticsUserViewedProductSchema?.index({ productId: 1, customerId: 1 }, { unique: true });

module.exports = {
    AnalyticsUserViewedProductSchema
}