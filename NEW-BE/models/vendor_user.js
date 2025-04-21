module.exports = (sequelize, DataTypes) => {
    const VendorUser = sequelize.define('VendorUser', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      vendor_admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      tableName: 'vendor_users',
      timestamps: false
    });
  
    VendorUser.associate = (models) => {
      VendorUser.belongsTo(models.Company, {
        foreignKey: 'company_id',
        as: 'company'
      });
  
      VendorUser.belongsTo(models.Vendor, {
        foreignKey: 'vendor_id',
        as: 'vendor'
      });
  
      VendorUser.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
  
      VendorUser.belongsTo(models.User, {
        foreignKey: 'vendor_admin_id',
        as: 'vendorAdmin'
      });
    };
    VendorUser.associate = (models) => {
        VendorUser.belongsTo(models.User, {
          foreignKey: 'user_id',
          as: 'user'
        });
        VendorUser.belongsTo(models.ProjectVendor, {
          foreignKey: 'vendor_id',
          targetKey: 'vendor_id',
          as: 'projectVendor'
        });
      };
    return VendorUser;
  };
  