const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bot = sequelize.define('Bot', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    merchantId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: 'Quick Bot'
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: '/assets/bot-avatar.png'
    },
    greeting: {
        type: DataTypes.TEXT,
        defaultValue: 'Hi! How can I help you today?'
    },
    tone: {
        type: DataTypes.ENUM('friendly', 'professional', 'casual', 'enthusiastic'),
        defaultValue: 'friendly'
    },
    flows: {
        type: DataTypes.JSONB,
        defaultValue: [
            {
                trigger: 'hello',
                response: 'Hello! Welcome to our store. How can I assist you?'
            },
            {
                trigger: 'help',
                response: 'I can help you with products, orders, or general questions!'
            }
        ]
    },
    faq: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    productRecommendations: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: []
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    analytics: {
        type: DataTypes.JSONB,
        defaultValue: {
            totalChats: 0,
            totalMessages: 0,
            conversions: 0
        }
    }
}, {
    timestamps: true
});

module.exports = Bot;
