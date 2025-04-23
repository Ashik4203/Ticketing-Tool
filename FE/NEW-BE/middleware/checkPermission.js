const { User, RolePermission, Permission } = require('../models');

const checkPermission = (requiredSlug) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id; // you should get user from auth middleware
      const user = await User.findByPk(userId);

      if (!user) return res.status(404).json({ error: 'User not found' });

      const permissions = await RolePermission.findAll({
        where: {
          role_id: user.role_id,
          company_id: user.company_id,
          status: 'active'
        },
        include: [{
          model: Permission,
          where: { slug: requiredSlug, status: 'active' }
        }]
      });

      if (permissions.length === 0) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

module.exports = checkPermission;
