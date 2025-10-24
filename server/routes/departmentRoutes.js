const express = require('express');
const router = express.Router();
const { getAllDepartments, getDepartmentDetails } = require('../controllers/departmentController');

router.get('/', getAllDepartments);
router.get('/:id', getDepartmentDetails);

module.exports = router;
