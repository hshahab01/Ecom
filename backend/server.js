const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const Model = require("./models/index")
connectDB();

const { errorHandler } = require('./middleware/errorMiddleware')
const colors = require('colors');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))




app.use('/api/user', require('./routes/userRoute'));
app.use('/api/product', require('./routes/productRoute'));
app.use('/api/cart', require('./routes/cartRoute'));
app.use('/api/order', require('./routes/orderRoute'));
app.use('/api/category', require('./routes/categoryRoute'));
app.use('/api/variant', require('./routes/variantRoute'));
// app.use('/api/payment', require('./routes/paymentRoute'));

app.use(errorHandler);

app.listen(port, console.log('Server started on  port ' + port))
