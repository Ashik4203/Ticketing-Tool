const Joi = require('joi');

// Validation schemas using Joi
const schemas = {
  register: Joi.object({
    name: Joi.string().trim().required().messages({
      'string.empty': 'Name is required',
      'any.required': 'Name is required'
    }),

    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email',
      'any.required': 'Email is required'
    }),

    password: Joi.string().min(8).pattern(new RegExp('\\d')).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one number',
      'any.required': 'Password is required'
    }),

    role: Joi.string().required().messages({
      'string.base': 'Role must be a valid string',
      'any.required': 'Role is required'
    }),

    project: Joi.when('role', {
      is: '3',
      then: Joi.string().trim().required().messages({
        'any.required': 'Project ID is required for role Project Admin',
        'string.empty': 'Project ID is required for role Project Admin'
      }),
      otherwise: Joi.optional()
    }),

    vendor: Joi.when('role', {
      is: Joi.valid('4', '5'),
      then: Joi.string().trim().required().messages({
        'any.required': 'Vendor ID is required for this role',
        'string.empty': 'Vendor ID is required for this role'
      }),
      otherwise: Joi.optional()
    }),

    vendor_admin: Joi.when('role', {
      is: '5',
      then: Joi.string().trim().required().messages({
        'any.required': 'Vendor Admin ID is required for role Vendor User',
        'string.empty': 'Vendor Admin ID is required for role Vendor User'
      }),
      otherwise: Joi.optional()
    })
  }),

  login: Joi.object({
    userName: Joi.string().trim().required().messages({
      'string.empty': 'userName is required',
      'any.required': 'userName is required'
    }),

    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
  })
};

// Middleware factory function for validation
const validateRequest = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        message: 'Internal server error - validation schema not found'
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,    // Return all errors, not just the first one
      stripUnknown: true    // Remove unknown keys from the validated data
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }));
      
      return res.status(400).json({
        message: 'Validation failed',
        errors: errorDetails
      });
    }

    // Replace req.body with validated data
    req.body = value;
    next();
  };
};

module.exports = {
  validateRequest
};