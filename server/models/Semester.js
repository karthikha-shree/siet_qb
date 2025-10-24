const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  regulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Regulation' },
});

module.exports = mongoose.model('Semester', semesterSchema);
