
const Project = require('./project');
const Vendor = require('./vendor');
const VendorUser = require('./vendor');
module.exports = (sequelize, DataTypes) => {
    const ProjectVendor = sequelize.define('ProjectVendor', {
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        vendor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
        }
    }, {
        tableName: 'project_vendors',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false // No updated_at in your table
    });
    ProjectVendor.associate = (models) => {
        ProjectVendor.belongsTo(models.Project, {
          foreignKey: 'project_id',
          as: 'project'
        });
        ProjectVendor.belongsTo(models.Vendor, {
          foreignKey: 'vendor_id',
          as: 'vendor'
        });
      };
      ProjectVendor.associate = (models) => {
        ProjectVendor.hasMany(models.VendorUser, {
          foreignKey: 'vendor_id',
          sourceKey: 'vendor_id',
          as: 'vendorUsers'
        });
      };

    return ProjectVendor;
};
