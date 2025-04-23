
'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const RolePermission = sequelize.define('RolePermission', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      permission_id: {
        type: DataTypes.INTEGER,
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
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false
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
      tableName: 'role_permission',
      timestamps: false
    });
  
    RolePermission.associate = (models) => {
      RolePermission.belongsTo(models.Role, {
        foreignKey: 'role_id'
      });
  
      RolePermission.belongsTo(models.Permission, {
        foreignKey: 'permission_id'
      });
    };
  
    return RolePermission;
  };
  