const { ProjectVendor, Project, Vendor } = require('../models');

// Create ProjectVendor
exports.create = async (req, res) => {
    try {
        const { project_id, vendor_id, start_date = null, end_date = null, status } = req.body;

        // If using auth middleware and company_id is in req.user
        const company_id = req.user?.company_id || req.body.company_id;

        if (!company_id) {
            return res.status(400).json({ error: 'company_id is required' });
        }

        const data = await ProjectVendor.create({
            project_id,
            vendor_id,
            company_id,
            start_date: start_date ?? null,  // If start_date is undefined, assign null
            end_date: end_date ?? null,      // If end_date is undefined, assign null
            status
        });


        res.status(201).json({ message: 'Project-Vendor created', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All
exports.getAll = async (req, res) => {
    try {
      const data = await ProjectVendor.findAll({
        where: {
          company_id: req.user?.company_id || req.query.company_id
        },
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'name']
          },
          {
            model: Vendor,
            as: 'vendor',
            attributes: ['id', 'name']
          }
        ]
      });
  
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get one ProjectVendor by ID with project and vendor info
  exports.getOne = async (req, res) => {
    try {
      const data = await ProjectVendor.findByPk(req.params.id, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'name']
          },
          {
            model: Vendor,
            as: 'vendor',
            attributes: ['id', 'name']
          }
        ]
      });
  
      if (!data) return res.status(404).json({ error: 'Not found' });
  
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update
exports.update = async (req, res) => {
    try {
        const record = await ProjectVendor.findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: 'Not found' });

        const updated = await record.update({
            project_id: req.body.project_id,
            vendor_id: req.body.vendor_id,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            status: req.body.status,
            company_id: req.body.company_id || record.company_id // Keep existing if not sent
        });

        res.status(200).json({ message: 'Updated successfully', data: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete
exports.delete = async (req, res) => {
    try {
        const record = await ProjectVendor.findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: 'Not found' });

        await record.destroy();
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
