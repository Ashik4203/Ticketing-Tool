const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const validateCompany = require('../middleware/companyValidation');
const companywithAdminValidation = require('../middleware/companywithAdminValidation');


router.post('/register-with-admin', companywithAdminValidation, companyController.registerCompanyWithAdmin);
router.post('/', validateCompany, companyController.createCompany);
router.get('/', validateCompany, companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

module.exports = router;
