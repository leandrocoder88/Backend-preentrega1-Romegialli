import express from 'express';
import Product from '../dao/models/product.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, category, available } = req.query;
        const limitNum = parseInt(limit, 10);
        const pageNum = parseInt(page, 10);
        let sortOptions = {};
        if (sort) {
            sortOptions.price = sort === 'asc' ? 1 : -1;
        }

        const filterOptions = {};
        if (query) {
            filterOptions.name = { $regex: query, $options: "i" };
        }
        if (category) {
            filterOptions.category = category;
        }
        if (available !== undefined) {
            filterOptions.available = available === 'true';
        }

        const products = await Product.find(filterOptions)
            .limit(limitNum)
            .skip(limitNum * (pageNum - 1))
            .sort(sortOptions)
            .exec();

        const totalProducts = await Product.countDocuments(filterOptions);
        const totalPages = Math.ceil(totalProducts / limitNum);

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: pageNum > 1 ? pageNum - 1 : null,
            nextPage: pageNum < totalPages ? pageNum + 1 : null,
            page: pageNum,
            hasPrevPage: pageNum > 1,
            hasNextPage: pageNum < totalPages,
            prevLink: pageNum > 1 ? `/api/products?page=${pageNum - 1}&limit=${limit}` : null,
            nextLink: pageNum < totalPages ? `/api/products?page=${pageNum + 1}&limit=${limit}` : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;

