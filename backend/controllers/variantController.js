const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
Models = require('../models/index');
const Variant = Models.Variant

//create a new variant
//POST /api/variant
const createVariant = asyncHandler(async (req, res) => {
    const { name } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const checkVariant = await Variant.findOne({where:{ name: name }});
        if (checkVariant) {
            res.status(400);
            throw new Error('Variant already exists')
        }
        const variant = await Variant.create({
            name,
        })
        variant.save();
        if (variant) {
            res.status(201).json({
                id: variant.id,
                variant: variant.name,
            });
        }
        else {
            res.status(400);
            throw new Error('Invalid input data');
        }
})

//POST /api/variant/get
const getVariant = asyncHandler(async (req, res) => {

    const variant = await Variant.findByPk(req.body.id);
        if (variant) {
            res.json({
                id: variant.id,
                name: variant.name,
            })
        }
        else {
            res.status(400);
            throw new Error('Variant not found')
        }
})



//POST /api/variant/update
const updateVariant = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const variant = await Variant.findByPk(req.body.id);
    if (!variant) {
        res.status(400);
        throw new Error('Variant not found');
    }
        await variant.update({
            name: name,
        });
        variant.save();
        res.status(200).json({
            id: variant.name,
            name: variant.name,
        });
});

//POST /api/variant/delete
const deleteVariant = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const variant = await Variant.findOne({where: {name: req.body.name}});
        if (variant) {
            await Variant.destroy({
                where: {
                  name: req.body.name,
                }
              });
            res.status(200).json({ message: 'Variant deleted successfully' });
        } else {
            res.status(400);
            throw new Error('Variant not deleted');
        }
});

module.exports = {
    createVariant,
    deleteVariant,
    updateVariant,
    getVariant,
}