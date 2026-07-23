const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Product = require('../models/Product');
const upload = require('./multerConfig');

// List with pagination and filtering/searching
router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', categoryId } = req.query;

        let products;
        if (search || categoryId) {
            products = await Product.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { description: { [Op.like]: `%${search}%` } }
                    ],
                    categoryId: categoryId ? Number(categoryId) : null,
                },
            });
        } else {
            products = await Product.findAll();
        }

        const count = products.length;
        const totalPages = Math.ceil(count / limit);
        const currentPage = page - 1 || 0;
        const paginatedProducts = products.slice(currentPage * limit, (currentPage + 1) * limit);

        return res.json({
            page: parseInt(page),
            total_pages: totalPages,
            count: count,
            data: paginatedProducts
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
    }
});

// Create single product
router.post('/products', async (req, res) => {
    try {
        const { name, price, description, categoryId, stockQuantity } = req.body;

        if (!name || !price) return res.status(400).json({ error: 'Name and Price are required' });

        const product = await Product.create({
            name,
            price,
            description,
            categoryId,
            stockQuantity
        });

        return res.json(product);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
    }
});

// Update product
router.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, categoryId, stockQuantity } = req.body;

        if (!name && !price) return res.status(400).json({ error: 'Name or Price is required' });

        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.update({
            name,
            price,
            description,
            categoryId,
            stockQuantity
        });

        return res.json(product);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
    }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.destroy();

        return res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
    }
});

// Bulk upload products
router.post('/products/bulk', upload.single('file'), async (req, res) => {
    try {
        const { file } = req;
        if (!file || !file.path) return res.status(400).json({ error: 'No file uploaded' });

        const productsData = require('fs').readFileSync(file.path, 'utf-8');
        const parsedProducts = JSON.parse(productsData);

        for (const product of parsedProducts) {
            await Product.create(product);
        }

        return res.json({ message: `${parsedProducts.length} products created` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
