const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

const { User, ProjectAdminUser, VendorUser, Permission, RolePermission } = require('../models');
const company = require('../models/company');

exports.register = async (req, res) => {
  try {
    const {
      name,
      password,
      email,
      role,
      project = '',
      vendor = '',
      vendor_admin = ''
    } = req.body;
    console.log(req.body)
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Validation based on role
    if (role == 3 && (!project || project === "")) {
      return res.status(400).json({ message: 'Project ID is required for role Project Admin' });
    }
    if (role == 4 && (!vendor || vendor === "")) {
      return res.status(400).json({ message: 'Vendor ID is required for role Vendor Admin' });
    }
    if (role == 5 && (!vendor || vendor === "" || !vendor_admin || vendor_admin === "")) {
      return res.status(400).json({ message: 'Vendor ID and Vendor Admin ID are required for role Vendor User' });
    }

    // Create user
    const user = await User.create({
      username: email,
      name,
      password,
      email,
      company_id: req.user?.company_id || null,
      status: 'active',
      role_id: role
    });

    // Role 3: Insert into project_admin_user
    if (role == 3) {
      await ProjectAdminUser.create({
        company_id: user.company_id || null,
        user_id: user.id,
        project_id: project,
        status: 'active',
        created_by: req.user?.id || 0,
        created_at: new Date()
      });
    }

    // Role 4 & 5: Insert into vendor_users
    if (role == 4 || role == 5) {
      await VendorUser.create({
        company_id: req.user?.company_id || null,
        vendor_id: vendor,
        user_id: user.id,
        vendor_admin_id: role == 5 ? vendor_admin : null,
        status: 'active',
        created_by: req.user?.id || 0,
        created_at: new Date()
      });
    }

    res.status(201).json({
      message: 'User registered successfully',
      userId: user.id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Find user using Sequelize
    const user = await User.findOne({
      where: { userName }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.userName,
        name: user.name,
        role: user.role_id,
        company_id: user.company_id ?? null,
      },
      JWT_SECRET,
      // { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

exports.rbac = async (req, res) => {
  try {
    const userId = req.user.id; // or pass userId from params/query

    // First, get user's role_id
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['role_id']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const permissions = await Permission.findAll({
      where: {
        status: 'active'
      },
      include: [
        {
          model: RolePermission,
          where: {
            role_id: user.role_id,
            status: 'active'
          },
          attributes: [] // only fetch from Permission table
        }
      ]
    });

    res.json({ permissions });
  } catch (error) {
    console.error('rbac error:', error);
    res.status(500).json({ message: 'Error during rbac' });
  }
};

