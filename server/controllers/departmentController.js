const Department = require('../models/Department');
const Regulation = require('../models/Regulation');
const Semester = require('../models/Semester');
const Subject = require('../models/Subject');

exports.getAllDepartments = async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
};

exports.getDepartmentDetails = async (req, res) => {
  const departmentId = req.params.id;
  const regulations = await Regulation.find({ departmentId });

  const detailed = await Promise.all(regulations.map(async (reg) => {
    const semesters = await Semester.find({ regulationId: reg._id });
    const semesterData = await Promise.all(semesters.map(async (sem) => {
      const subjects = await Subject.find({ semesterId: sem._id });
      return { ...sem._doc, subjects };
    }));
    return { ...reg._doc, semesters: semesterData };
  }));

  res.json({ departmentId, regulations: detailed });
};
