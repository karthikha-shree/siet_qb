const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
  files: [
    {
      fileName: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now },
    }
  ]
});

module.exports = mongoose.model('Subject', subjectSchema);
