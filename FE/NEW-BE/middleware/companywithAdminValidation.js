const Joi = require('joi');

const companywithAdminValidation = (req, res, next) => {
  const schema = Joi.object({
    company: Joi.object({
      name: Joi.string().required(),
      subscription_plan: Joi.string().valid('free', 'basic', 'professional', 'enterprise').required(),
      subscription_status: Joi.string().valid('active', 'inactive', 'trial').required(),
      trial_ends_at: Joi.date().optional()
    }),
    admin: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    })
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

module.exports = companywithAdminValidation;
