module.exports = (sequelize, DataTypes) => {
    const ProjectAdminUser = sequelize.define('ProjectAdminUser', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      company_id: { // (Note: typo in column name; see note below)
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'user id'
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'project id'
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'vendor id'
      },
      status: {
        type: DataTypes.ENUM('active', 'iniactive'), // Note: "iniactive" may be a typo
        allowNull: false,
        comment: 'vendor'
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
      tableName: 'project_admin_user',
      timestamps: false // Disable if you're managing timestamps manually
    });
  
    ProjectAdminUser.associate = (models) => {
      ProjectAdminUser.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
  
      ProjectAdminUser.belongsTo(models.Project, {
        foreignKey: 'project_id',
        as: 'project'
      });
  
      ProjectAdminUser.belongsTo(models.Company, {
        foreignKey: 'company_id',
        as: 'company'
      });
    };
  
    return ProjectAdminUser;
  };
  