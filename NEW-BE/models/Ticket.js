// models/Ticket.js
module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('Ticket', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        module: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        source: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        behalf_of: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        ticket_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        attachment: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        problem_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            defaultValue: 'medium',
        },
        status_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        vendor_admin_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        vendor_employee_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'tickets',
        timestamps: false, // or true if you have createdAt and updatedAt managed automatically
    });
    Ticket.associate = (models) => {
        Ticket.belongsTo(models.User, {
          foreignKey: 'created_by',
          as: 'createdBy'
        });
      
        Ticket.belongsTo(models.User, {
          foreignKey: 'assigned_to',
          as: 'assignedTo'
        });
      
        Ticket.belongsTo(models.Project, {
          foreignKey: 'project_id',
          as: 'project'
        });
      
        Ticket.belongsTo(models.TicketStatus, {
          foreignKey: 'status_id',
          as: 'ticketsStatus'
        });
      };
      

    return Ticket;
};
