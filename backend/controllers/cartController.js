const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
Models = require('../models/index')
const User = Models.User;
const Cart = Models.Cart;
const Variant = Models.Variant;
const Product = Models.Product;
const cart_item = Models.cart_item;
const variant_product = Models.variant_product;


const addItem = asyncHandler(async (req, res) => {
    let { name, variant, quantity } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.decode(token)
    const cart = await Cart.findOne({ where: { user_id: decoded.id } });
    let items = await cart.getCart_items();
    let temp = await Product.findOne({ where: { name: name } });
    let temp1 = await Variant.findOne({ where: { name: variant } });
    const vids = items.map((temp) => temp.variant_id);
    const pids = items.map((temp) => temp.product_id);
    let temp2 = await variant_product.findAll({ where: { variant_id: temp1.id, product_id: temp.id } });
    temp2 = temp2.map((temp) => temp.price);
    if (vids.includes(temp1.id) && pids.includes(temp.id)) {
        await cart_item.increment({ quantity: quantity }, { where: { cart_id: cart.id, product_id: temp.id, variant_id: temp1.id } })
        await Cart.increment({ count: quantity, total: temp2 }, { where: { id: cart.id } })
        await variant_product.decrement({ quantity: quantity }, { where: { product_id: temp.id, variant_id: temp1.id } })
    }
    else {
        await cart.createCart_item({ quantity: quantity, product_id: temp.id, variant_id: temp1.id });
        await Cart.increment({ count: quantity, total: temp2 * quantity }, { where: { id: cart.id } })
        await variant_product.decrement({ quantity: quantity }, { where: { product_id: temp.id, variant_id: temp1.id } })
    }
    res.status(201).json('Item added');
});

const deleteItem = asyncHandler(async (req, res) => {
    let { name, variant, quantity } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.decode(token)
    const cart = await Cart.findOne({ where: { user_id: decoded.id } });
    let temp = await Product.findOne({ where: { name: name } });
    let temp1 = await Variant.findOne({ where: { name: variant } });
    let temp2 = await variant_product.findAll({ where: { variant_id: temp1.id, product_id: temp.id } });
    temp2 = temp2.map((temp) => temp.price);
    if (quantity) {
        await cart_item.decrement({ quantity: quantity }, { where: { cart_id: cart.id, product_id: temp.id, variant_id: temp1.id } })
        await variant_product.increment({ quantity: quantity }, { where: { product_id: temp.id, variant_id: temp1.id } })
        await cart_item.destroy({
            where: {
                quantity: {
                    [Op.lte]: 0
                },
                cart_id: cart.id,
            }
        });
        await Cart.decrement({ count: quantity, total: temp2 * quantity }, { where: { id: cart.id } })
    }
    else {
        let items = await cart.getCart_items();
        const vids = items.map((temp) => temp.variant_id);
        const pids = items.map((temp) => temp.product_id);
        const quantity = items.map((temp) => temp.quantity);
        for (let i = 0; i < quantity.length; i++) {
            await variant_product.increment({ quantity: quantity[i] }, { where: { product_id: pids[i], variant_id: vids[i] } })
        }
        await cart_item.destroy({
            where: {
                cart_id: cart.id,
                product_id: temp.id,
                variant_id: temp1.id
            }
        });
        await cart.update({
            count: 0,
            total: 0,
        });
    }
    res.status(200).json({ message: 'Item(s) deleted from cart' });
});

const getCart = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.decode(token)
    const cart = await Cart.findOne({ where: { user_id: decoded.id } });
    let items = await cart.getCart_items();
    const pids = items.map((temp) => temp.product_id);
    const vids = items.map((temp) => temp.variant_id);
    let quantity = items.map((temp) => temp.quantity);
    let temp = await Product.findAll({ where: { id: pids } });
    let temp1 = await Variant.findAll({ where: { id: vids } });
    let temp2 = await variant_product.findAll({ where: { variant_id: vids, product_id: pids } });
    temp = temp.map((temp) => temp.name);
    temp1 = temp1.map((temp) => temp.name);
    temp2 = temp2.map((temp) => temp.price);
    let sum = 0;
    let each = [];
    for (let i = 0; i < quantity.length; i++) {
        each[i] = quantity[i] * temp2[i];
        sum = sum + each[0];
    }
    if (items) {
        res.status(200).json({
            item: temp,
            variant: temp1,
            ppu: each,
            total: sum
        })
    }

});

module.exports = { addItem, deleteItem, getCart };