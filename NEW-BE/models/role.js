

'use strict';

const { DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
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
      tableName: 'roles',
      timestamps: false
    });
  
    Role.associate = (models) => {
      Role.hasMany(models.User, {
        foreignKey: 'role_id'
      });
  
      Role.hasMany(models.RolePermission, {
        foreignKey: 'role_id'
      });
    };
  
    return Role;
  };
  