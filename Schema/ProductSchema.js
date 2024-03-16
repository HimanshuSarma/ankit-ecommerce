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
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admins', required: true }
}, { timestamps: true });

module.exports = {
    ProductSchema,
}