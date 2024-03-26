const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true, unique: true },
    images: [
        {
            url: { type: mongoose.Schema.Types.String, required: true },
            description: { type: mongoose.Schema.Types.String, default: '' }
        }
    ],
    price: { type: mongoose.Schema.Types.Number, required: true },
    stock: { type: mongoose.Schema.Types.Number, min: 1, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admins', required: true }
}, { timestamps: true });

ProductSchema.methods.responseDoc = function () {
    const doc = this._doc;
    return doc;
};

module.exports = {
    ProductSchema,
}