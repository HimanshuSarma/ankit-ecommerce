const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admins', required: true }
}, { timestamps: true });


module.exports = {
    CategorySchema,
}