const { Vendor } = require('../models');

// Create a vendor
exports.create = async (req, res) => {
    try {
      const { name, contact_person, email, phone, address, service_type, status } = req.body;
      const companyId = req.user?.company_id || req.body.company_id;
    //   console.log('user Details:', req.user.company_id, req.user.id);
      const userId = req.user?.id || req.body.user_id;
      const vendor = await Vendor.create({
        name,
        contact_person,
        email,
        phone,
        address,
        service_type,
        status,
        company_id: companyId,  // or req.user.company_id if using auth
        created_by: userId  // or req.user.id if using auth
      });
  
      res.status(201).json({ message: 'Vendor created successfully', data: vendor });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get all vendors
exports.getAll = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.status(200).json({ data: vendors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get vendor by ID
exports.getOne = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.status(200).json({ data: vendor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update vendor
// Update vendor
exports.update = async (req, res) => {
    try {
      const vendor = await Vendor.findByPk(req.params.id);
      if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
  
      // Prevent updating created_by and company_id
      const { created_by, company_id, ...updatableFields } = req.body;
  
      await vendor.update(updatableFields);
      res.status(200).json({ message: 'Vendor updated', data: vendor });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Delete vendor
exports.delete = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    await vendor.destroy();
    res.status(200).json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
