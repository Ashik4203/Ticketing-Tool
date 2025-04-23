const { Company } = require('../models');
const { User } = require('../models');

// Create company

exports.registerCompanyWithAdmin = async (req, res) => {
    const t = await Company.sequelize.transaction(); // transaction for rollback if needed
    try {
        const { company, admin } = req.body;

        // 1. Check if company name already exists
        const existingCompany = await Company.findOne({ where: { name: company.name } });
        if (existingCompany) {
            return res.status(400).json({ error: 'Company with this name already exists' });
        }

        // 2. Check if admin email already exists
        const existingUser = await User.findOne({ where: { email: admin.email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // 3. Create company
        const newCompany = await Company.create(company, { transaction: t });

        
        // 5. Create admin user
        const newUser = await User.create({
            name: admin.name,
            email: admin.email,
            username: admin.email,
            password: admin.password,
            company_id: newCompany.id,
            role_id: 2, // assuming 2 is the role ID for admin
            status: 'active'
        }, { transaction: t });

        await t.commit();

        res.status(201).json({
            message: 'Company and admin created successfully',
            company: newCompany,
            admin: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.createCompany = async (req, res) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all companies
exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll();
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single company by ID
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update company
exports.updateCompany = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        await company.update(req.body);
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete company
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        await company.destroy();
        res.json({ message: 'Company deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
