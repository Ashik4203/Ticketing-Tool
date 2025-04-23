const { Project } = require('../models');

// Create a project
exports.create = async (req, res) => {
    try {
        // Assuming user info is attached to req.user (e.g., via middleware)
        const companyId = req.user?.company_id || req.body.company_id;
        const userId = req.user?.id || req.body.user_id;

        if (!companyId || !userId) {
            return res.status(400).json({ error: 'Missing company_id or user_id' });
        }

        const project = await Project.create({
            ...req.body,
            company_id: companyId,
            created_by: userId
        });

        res.status(201).json({ message: 'Project created', data: project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all projects
exports.getAll = async (req, res) => {
    try {
        const companyId = req.user?.company_id || req.query.company_id;

        const whereClause = companyId ? { company_id: companyId } : {};
        const projects = await Project.findAll({ where: whereClause });

        res.status(200).json({ data: projects });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get project by ID
exports.getOne = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.status(200).json({ data: project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update project
exports.update = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        await project.update(req.body);
        res.status(200).json({ message: 'Project updated', data: project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete project
exports.delete = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        await project.destroy();
        res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
