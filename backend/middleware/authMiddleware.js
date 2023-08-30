
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Models = require('../models/index');

const User = Models.User;

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        const temp = jwt.decode(token)
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            req.user = await User.findByPk(decoded.id)

            next();
        } catch (err) {
            console.log(err.message)
            if (err.message === 'jwt expired') {

                try {
                    let refreshToken = generateRefreshToken(temp.id, temp.val);
                    let newAccessToken = await regenerateAccessToken(refreshToken);
                    req.headers.authorization = `Bearer ${newAccessToken}`;
                    // Recall the protect function with the new access token
                    return protect(req, res, next);
                } catch (err) {
                    console.log('Error while refreshing access token:', err.message);
                    return res.status(401).send('Unauthorized');
                }
            } else if (err.message === 'invalid signature') {
                console.log("Invalid token");
                return res.status(401).send("Invalid token");
            } else {
                next(err);
            }
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
})

const generateAccessToken = (id, val) => {
    return jwt.sign({ id, val }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '20s',
    })
}
const generateRefreshToken = (id, val) => {
    return jwt.sign({ id, val }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '10d',
    })
}

const regenerateAccessToken = (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccess = generateAccessToken(decoded.id, decoded.val);
    return newAccess;
}

// const regenerateAccessToken = asyncHandler(async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1]

//             const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

//             const newAccess = generateAccessToken(decoded.id);

//             res.status(200).json(newAccess);
//             next();
//         } catch (error) {
//             console.log(error);
//             res.status(401)
//             throw new Error('Not authorized');
//         }
//     }
//     if (!token) {
//         res.status(401);
//         throw new Error('Not authorized, no token');
//     }
// })

const isAdmin = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        const temp = jwt.decode(token)
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            let id = decoded.id;
            //console.log(id);            
            if (decoded.val != 1) {
                return res.status(401).send('Unauthorized');
            }
            req.user = await User.findByPk(decoded.id)

            next();
        } catch (err) {
            console.log(err.message)
            if (err.message === 'jwt expired') {
                try {
                    let refreshToken = generateRefreshToken(temp.id, temp.val);
                    let newAccessToken = regenerateAccessToken(refreshToken);
                    req.headers.authorization = `Bearer ${newAccessToken}`;
                    // Recall the protect function with the new access token
                    return isAdmin(req, res, next);
                } catch (err) {
                    console.log('Error while refreshing access token:', err.message);
                    return res.status(401).send('Unauthorized');
                }
            } else if (err.message === 'invalid signature') {
                console.log("Invalid token");
                return res.status(401).send("Invalid token");
            } else {
                next(err);
            }
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
})

module.exports = {
    protect,
    generateAccessToken,
    generateRefreshToken,
    regenerateAccessToken,
    isAdmin,
};