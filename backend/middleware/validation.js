
const { param, body, validationResult, checkSchema } = require('express-validator');
const Model = require('../models/index');

module.exports = {
  userValidation: () => {
    return [
      body('data').custom(async (value, { req }) => {
        await Promise.all([
          body('username').notEmpty().withMessage('Username is mandatory').run(req),
          body('email').notEmpty().trim().isEmail().withMessage('Invalid email').run(req),
          body('password').notEmpty().isLength({ min: 8, max: 12 }).withMessage('Invalid password').run(req),
          body('contact').notEmpty().trim().isMobilePhone().withMessage('Invalid contact').run(req),
          body('role').notEmpty().withMessage('Role is mandatory').run(req),
        ]);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new Error('Invalid input data');
        }
      })
    ]
  },
}

const arrayNotEmpty = (value) => {
  if (Array.isArray(value) && value.length === 0) {
    throw new Error('Array must not be empty.');
  }
  return true;
};
