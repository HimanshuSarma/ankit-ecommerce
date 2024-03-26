const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admins', required: true }
}, { timestamps: true });

CategorySchema.methods.leanDoc = function () {
    const doc = this._doc;
    return doc;
};

module.exports = {
    CategorySchema,
}