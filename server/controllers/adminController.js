const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin'); 
const Department = require('../models/Department');
const Regulation = require('../models/Regulation');
const Semester = require('../models/Semester');
const Subject = require('../models/Subject');
const cloudinary = require('cloudinary').v2;

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: 'Invalid email' });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};

exports.createAdmin = async (req, res) => {
  const { email, password } = req.body;
  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Admin already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ email, password: hashedPassword });
  res.json(admin);
};

exports.addDepartment = async (req, res) => {
  const { name } = req.body;
  const dept = await Department.create({ name });
  res.json(dept);
};

exports.addRegulation = async (req, res) => {
  const { departmentId, year } = req.body;
  const reg = await Regulation.create({ year, departmentId });

  const sems = [];
  for (let i = 1; i <= 8; i++) {
    const semester = new Semester({ number: i, regulationId: reg._id });
    await semester.save();
    sems.push(semester);
  }

  res.json({ regulation: reg, semesters: sems });
};

exports.addSubject = async (req, res) => {
  const { semesterId, name } = req.body;
  const subject = await Subject.create({ name, semesterId, files: [] });
  res.json(subject);
};

exports.uploadFile = async (req, res) => {
  const subjectId = req.params.subjectId;
  const file = req.file;

  const uploadResult = await cloudinary.uploader.upload(file.path, {
    folder: 'sietqb_pdfs',
    resource_type: 'raw'
  });

  const subject = await Subject.findById(subjectId);
  subject.files.push({
    fileName: file.originalname,
    fileUrl: uploadResult.secure_url
  });
  await subject.save();

  res.json(subject);
};
exports.deleteSubject = async (req, res) => {
  const subjectId = req.params.id;
  await Subject.findByIdAndDelete(subjectId);
  res.json({ message: 'Subject deleted' });
};

exports.deleteFile = async (req, res) => {
  const { subjectId, fileUrl } = req.params;
  const subject = await Subject.findById(subjectId);
  subject.files = subject.files.filter(f => f.fileUrl !== decodeURIComponent(fileUrl));
  await subject.save();
  res.json({ message: 'File removed' });
};

exports.updateSubjectName = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    subject.name = req.body.name;
    await subject.save();

    console.log("✅ Subject updated:", subject.name);
    res.json(subject);
  } catch (err) {
    console.error("❌ Error updating subject:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
