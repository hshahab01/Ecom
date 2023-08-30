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


const placeOrder = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.decode(token)
    const user = await User.findOne({ where: { id: decoded.id } });
    const cart = await Cart.findOne({ where: { user_id: decoded.id } });
    let order = await user.createOrder();
    let items = await cart.getCart_items();
    const vids = items.map((temp) => temp.variant_id);
    const pids = items.map((temp) => temp.product_id);
    const quantity = items.map((temp) => temp.quantity);
    console.log(quantity)

    if (items.length != 0) {
        for (let i = 0; i < items.length; i++) {
            await order.createOrder_item({ quantity: quantity[i], product_id: pids[i], variant_id: vids[i] });
        }
        await cart_item.destroy({
            where: {
                cart_id: cart.id,
            }
        });
        await order.update({
            status: 'placed',
            subtotal: cart.total,
            tax: cart.total * 13 / 100,
            total: cart.total + cart.total * 13 / 100,
        });
        await cart.update({
            count: 0,
            total: 0,
        });
        res.status(200).json('Order placed')
    }
    else {
        res.status(400).json('Cart empty')
    }


});

const cancelOrder = asyncHandler(async (req, res) => {
    token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.decode(token)
    const order = await Order.findOne({ where: { user_id: decoded.id } });
    let items = await order.getOrder_items();
    const vids = items.map((temp) => temp.variant_id);
    const pids = items.map((temp) => temp.product_id);
    const quantity = items.map((temp) => temp.quantity);
    for (let i = 0; i < quantity.length; i++) {
        await variant_product.increment({ quantity: quantity[i] }, { where: { product_id: pids[i], variant_id: vids[i] } })
    }
    await order_item.destroy({
        where: {
            order_id: order.id,
        }
    });
    await order.update({
        status: 'cancelled',
    });

    res.status(200).json({ message: 'Order cancelled' });
});

const getOrder = asyncHandler(async (req, res) => {
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

module.exports = { placeOrder, cancelOrder, getOrder };