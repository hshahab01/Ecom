const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
Models = require('../models/index');
const Category = Models.Category

//create a new category
//POST /api/category
const createCategory = asyncHandler(async (req, res) => {
    const { name, pname } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const checkCategory = await Category.findOne({ where: { name: name } });
    if (checkCategory) {
        res.status(400);
        throw new Error('Category already exists')
    }
    let getPid;
    let pid;
    if (pname) {
        getPid = await Category.findOne({ where: { name: pname } });
        if (!getPid) {
            res.status(400);
            throw new Error('Parent category not found')
        }
        pid = getPid.id;
    }
    const category = await Category.create({
        name,
        pid,
    })
    category.save();
    if (category) {
        res.status(201).json({
            id: category.id,
            category: category.name,
            pid: category.pid,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid input data');
    }
})

//POST /api/category/get
const getCategory = asyncHandler(async (req, res) => {

    const category = await Category.findByPk(req.body.id);
    if (category) {
        res.json({
            id: category.id,
            name: category.name,
            pid: category.pid,
        })
    }
    else {
        res.status(400);
        throw new Error('Category not found')
    }
})



//POST /api/category/update
const updateCategory = asyncHandler(async (req, res) => {
    const { name, pid } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const category = await Category.findByPk(req.body.id);
    if (!category) {
        res.status(400);
        throw new Error('Category not found');
    }
    await category.update({
        name: name,
        pid: pid,
    });
    category.save();
    res.status(200).json({
        id: category.name,
        name: category.name,
        pid: category.pid,
    });
});

//POST /api/category/delete
const deleteCategory = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const category = await Category.findOne({ where: { name: req.body.name } });
    if (category) {
        await Category.destroy({
            where: {
                name: req.body.name,
            }
        });
        res.status(200).json({ message: 'Category deleted successfully' });
    } else {
        res.status(400);
        throw new Error('Category not deleted');
    }
});

module.exports = {
    createCategory,
    deleteCategory,
    updateCategory,
    getCategory,
}