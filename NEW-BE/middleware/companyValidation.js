const Joi = require('joi');

// Define the validation schema
const companySchema = Joi.object({
  name: Joi.string().max(100).required(),
  subscription_plan: Joi.string().valid('free', 'basic', 'professional', 'enterprise').optional(),
  subscription_status: Joi.string().valid('active', 'inactive', 'trial').optional(),
  trial_ends_at: Joi.date().optional()
});

// Middleware to validate company input
const validateCompany = (req, res, next) => {
  const { error } = companySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validateCompany;
