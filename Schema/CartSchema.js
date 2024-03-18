const mongoose = require('mongoose');

const ProductInCartObj = {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'products' },
    count: { type: mongoose.Schema.Types.Number, required: true }
};

const CartModel = {
    products: [ProductInCartObj],
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'customers', unique: true }
}

const CartSchema = new mongoose.Schema(CartModel, { timestamps: true });

module.exports = {
    CartSchema,
    CartModel,
    ProductInCartObj
}