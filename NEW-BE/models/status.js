

module.exports = (sequelize, DataTypes) => {
    const TicketStatus = sequelize.define('TicketStatus', {
      status: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status_text: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    }, {
      tableName: 'ticket_status',
      timestamps: false,  // Since your table has custom column names for created_at and updated_at
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
    TicketStatus.associate = (models) => {
        TicketStatus.hasMany(models.Ticket, {
          foreignKey: 'status_id',
          as: 'ticketsStatus'
        });
      };
    return TicketStatus;
};
