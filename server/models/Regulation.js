const mongoose = require('mongoose');

const regulationSchema = new mongoose.Schema({
  year: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
});

module.exports = mongoose.model('Regulation', regulationSchema);
