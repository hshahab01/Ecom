const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const jwt = require('jsonwebtoken');
Models = require('../models/index')
const { generateAccessToken, generateRefreshToken } = require('../middleware/authMiddleware');
User = Models.User;
Role = Models.Role;


//register a new user
//POST /api/user
const createUser = asyncHandler(async (req, res) => {
    const { username, email, password, contact, role } = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const checkUser = await User.findOne({ where: { email: email } });

    if (checkUser) {
        res.status(400);
        throw new Error('User already exists')
    }



    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    let temp;
    temp = await Role.findOne({ where: { value: role } });
    if (!temp) {
        res.status(400);
        throw new Error('Role not found')
    }

    const roleId = temp.id;

    const user = await User.create({
        username,
        email,
        password: hashedPass,
        contact,
    })
    user.save();

    await user.addRole(roleId);
    await user.createCart();

    if (user) {
        const userData = JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            role: role,
        });

        const fileName = `${email}.json`;

        fs.access('./files/' + fileName, fs.constants.F_OK, (err) => {
            if (!err) {
                res.status(400);
                throw new Error('User data file already exists');
            }

            fs.writeFile('./files/' + fileName, userData, (writeErr) => {
                if (writeErr) {
                    res.status(500);
                    throw new Error('Failed to save user data');
                }
            });
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            contact: user.contact,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid input data');
    }
})

//POST /api/user/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const user = await User.findOne({ where: { email: email } });
    //console.log(user)

    if (user && (await bcrypt.compare(password, user.password))) {
        const role = await user.getRoles();
        //console.log(role)
        const val = role.value;
        console.log(val)
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateAccessToken(user.id, val),
            refreshToken: generateRefreshToken(user.id, val),

        })
    }
    else {
        res.status(400);
        throw new Error('User not found')
    }
})

//POST /api/user/get
const getUser = asyncHandler(async (req, res) => {

    token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.decode(token)
    const user = await User.findByPk(decoded.id);

    if (user) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            contact: user.contact,
        })
    }
    else {
        res.status(400);
        throw new Error('User not found')
    }

})



//POST /api/user/update
const updateUser = asyncHandler(async (req, res) => {
    const { username, contact, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.decode(token)
    const user = await User.findByPk(decoded.id);
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }

    await user.update({
        username: username,
        email: email,
        contact: contact,
        password: hashedPass,
    });
    user.save();

    const userData = JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        contact: user.contact,
    });

    const fileName = `${email}.json`;

    fs.appendFile('./files/' + fileName, "\n" + userData, (writeErr) => {
        if (writeErr) {
            res.status(500);
            throw new Error('Failed to save user data');
        }
        else {
            console.log('updated')
        }
    });
    res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        contact: user.contact,
    });
});

//POST /api/user/delete
const deleteUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.decode(token)
    const user = await User.findByPk(decoded.id);    
    if (user) {
        const fileName = `${req.body.email}.json`;
        await User.destroy({
            where: {
                id: decoded.id,
            }
        });
        fs.unlink('./files/' + fileName, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });
        res.status(200).json({ message: 'User deleted successfully' });
    } else {
        res.status(400);
        throw new Error('User not deleted');
    }
});

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    getUser,
    login,
}