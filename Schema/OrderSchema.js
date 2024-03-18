const mongoose = require('mongoose');

const { ProductInCartObj, CartModel } = require('./CartSchema');

const ProductOrderSchema = new mongoose.Schema({
    ...ProductInCartObj,
    price: { type: mongoose.Schema.Types.Number, required: true }
});

const OrderSchema = new mongoose.Schema({
    cart: {
        ...CartModel,
        products: [ProductOrderSchema],
    },
    totalCost: { type: mongoose.Schema.Types.Number, required: true },
    status: { type: mongoose.Schema.Types.String, required: true, 
        enum: ['error', 'pending', 'placed', 'accepted', 'dispatched', 'out for delivery', 'delivered'] 
    },
    description: { type: mongoose.Schema.Types.String, default: '' },
    orderPaymentId: { type: mongoose.Schema.Types.String, default: '' }
}, { timestamps: true });

module.exports = {
    OrderSchema
}