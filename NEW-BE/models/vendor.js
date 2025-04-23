module.exports = (sequelize, DataTypes) => {
    const Vendor = sequelize.define('Vendor', {
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      contact_person: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.TEXT,
      service_type: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'vendors',
      timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    Vendor.associate = (models) => {
        Vendor.hasMany(models.ProjectVendor, {
          foreignKey: 'vendor_id',
          as: 'project_vendors'
        });
      };
      
    return Vendor;
  };
  