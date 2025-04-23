// models/ticket_history.js

module.exports = (sequelize, DataTypes) => {
    const TicketHistory = sequelize.define('TicketHistory', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        }
    }, {
        tableName: 'ticket_history',
        timestamps: false, // We use created_at manually, no updated_at
        underscored: true,
    });

    TicketHistory.associate = (models) => {
        TicketHistory.belongsTo(models.Ticket, { foreignKey: 'ticket_id' });
        TicketHistory.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return TicketHistory;
};
