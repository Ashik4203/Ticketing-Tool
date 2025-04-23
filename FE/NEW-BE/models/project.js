'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        tableName: 'projects',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    Project.associate = (models) => {
        Project.hasMany(models.ProjectVendor, {
          foreignKey: 'project_id',
          as: 'project_vendors'
        });
      };
      Project.associate = (models) => {
        Project.hasMany(models.Ticket, {
          foreignKey: 'project_id',
          as: 'tickets'
        });
      };
    return Project;
};
