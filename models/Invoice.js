const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    merchantId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerEmail: {
        type: DataTypes.STRING
    },
    customerPhone: {
        type: DataTypes.STRING
    },
    items: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    taxRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0
    },
    taxAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
        defaultValue: 'draft'
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true
});

// Auto-generate invoice number before creation
Invoice.beforeCreate(async (invoice) => {
    const lastInvoice = await Invoice.findOne({
        where: { merchantId: invoice.merchantId },
        order: [['createdAt', 'DESC']],
        limit: 1
    });
    
    const year = new Date().getFullYear();
    const sequence = lastInvoice ? parseInt(lastInvoice.invoiceNumber.split('-').pop()) + 1 : 1;
    invoice.invoiceNumber = `INV-${year}-${String(sequence).padStart(6, '0')}`;
});

module.exports = Invoice;
