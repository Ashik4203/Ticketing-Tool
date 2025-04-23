'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subscription_plan: {
        type: DataTypes.ENUM('free', 'basic', 'professional', 'enterprise'),
        defaultValue: 'free'
      },
      subscription_status: {
        type: DataTypes.ENUM('active', 'inactive', 'trial'),
        defaultValue: 'trial'
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      trial_ends_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      ticket_id_prefix: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'TKT',
      },
      ticket_separator: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: '-',
      },
      ticket_number_digit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: '3',
      }
    }, {
      tableName: 'companies',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  
    return Company;
  };
  