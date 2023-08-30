const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
Models = require('../models/index');
const Product = Models.Product
const Category = Models.Category
const Variant = Models.Variant
const variant_product = Models.variant_product

//create a new product
//POST /api/product
const createProduct = asyncHandler(async (req, res) => {
    const { name, quantity, variant, category, price } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const checkProduct = await Product.findOne({ where: { name: name } });
    let product;
    let temp;
    let varId;
    if (checkProduct) {
        if (variant) {
            temp = await Variant.findOne({ where: { name: variant } });
            if (!temp) {
                res.status(400);
                throw new Error('Variant not found')
            }
        }
        else {
            temp = await Variant.findOne({ where: { name: 'regular' } });
        }
        varId = temp.id;
        let currVar = await checkProduct.getVariants();
        const varIds = currVar.map((temp) => temp.id);
        currVar = await Variant.findAll({ where: { id: varIds } })
        if (varIds.includes(varId)) {
            res.status(400);
            throw new Error('Product with specified variant already exists')
        }
        await checkProduct.addVariant(varId, { through: { price, quantity } })

    }
    else {
        if (variant) {
            temp = await Variant.findOne({ where: { name: variant } });
            if (!temp) {
                res.status(400);
                throw new Error('Variant not found')
            }
        }
        else {
            temp = await Variant.findOne({ where: { name: 'regular' } });
        }
        varId = temp.id;
        let cat;
        if (category) {
            cat = await Category.findOne({ where: { name: category } });
            if (!cat) {
                res.status(400);
                throw new Error('Product category not found')
            }
        }
        const cid = cat.id;
        product = await Product.create({
            name,
            category_id: cid,
        })
        await product.save();
        await product.addVariant(varId, { through: { price, quantity } })
    }

    if (product || checkProduct) {
        res.status(201).json({
            product: name,
            quantity: quantity,
            variant: variant,
            category: category,
            price: price,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid input data');
    }
})

//POST /api/product/get
const getProduct = asyncHandler(async (req, res) => {
    //get data on all productss
    const getData = await Product.findAll({
        where: {
            name: req.body.name
        },
        //eager load to referred variant model
        include: {
            model: Variant,
            //Select what values are taken from pivot table
            through: {
                attributes: ['price', 'quantity']
            },
            //only name taken from variant table
            attributes: ['name'],
        },
        raw: true,
        attributes: ['name']
    });

    if (getData) {
        res.json(getData);
    }
    else res.json("error")
});



//POST /api/product/update
const updateProduct = asyncHandler(async (req, res) => {
    let { cname, name, quantity, variant, category, price } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const checkProduct = await Product.findOne({ where: { name: cname } });
    let temp;
    let varId;
    if (checkProduct) {
        if (variant) {
            temp = await Variant.findOne({ where: { name: variant } });
            if (!temp) {
                res.status(400);
                throw new Error('Variant not found')
            }
            varId = temp.id;
            if (price) {
                await variant_product.update(
                    {
                        price: price,
                    },
                    {
                        where: { variant_id: varId, product_id: checkProduct.id }
                    }
                );
            }
            if (quantity) {
                await variant_product.increment({ quantity: quantity }, { where: { variant_id: varId, product_id: checkProduct.id } })

            }
        }
        let cat;
        let cid;
        if (category) {
            cat = await Category.findOne({ where: { name: category } });
            if (!cat) {
                res.status(400);
                throw new Error('Product category not found')
            }
            cid = cat.id;
        }
        else{
            cid = checkProduct.category_id;
        }
        let newName;
        if (name) {
            newName = name;
        }
        else {
            newName = cname;
        }
        await checkProduct.update({
            name: newName,
            category_id: cid,
        })
        await checkProduct.save();
    }
    if (checkProduct) {
        res.status(201).json({
            product: checkProduct.name,
            quantity: quantity,
            variant: variant,
            category: category,
            price: price,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid input data');
    }
});

//POST /api/product/delete
const deleteProduct = asyncHandler(async (req, res) => {
    const { name, variant } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const product = await Product.findOne({ where: { name: name } });
    if (product) {
        if (variant) {
            temp = await Variant.findOne({ where: { name: variant } });
            if (!temp) {
                res.status(400);
                throw new Error('Variant not found')
            }
            varId = temp.id;
            await checkProduct.removeVariant(varId)
        }
        else {
            await Product.destroy({
                where: {
                    name: name,
                }
            });
            res.status(200).json({ message: 'Product deleted successfully' });
        }
    } else {
        res.status(400);
        throw new Error('Product not deleted');
    }
});

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getProduct,
}