module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_super_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      tableName: 'permission',
      timestamps: false
    });
  
    Permission.associate = (models) => {
      Permission.hasMany(models.RolePermission, {
        foreignKey: 'permission_id'
      });
    };
  
    return Permission;
  };
  