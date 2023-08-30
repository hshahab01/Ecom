const Sequelize = require('sequelize');

const connectDB = async () => {
  const sequelize = new Sequelize('ecom', 'root', '', {
    host: 'localhost',
    dialect:'mysql',
    logging: false,
    underscored: true,
  });
  try {
    await sequelize.authenticate();
    console.log(`MySQL Connected: ${sequelize.config.database}`.cyan.underline)
  } catch (error) {
    console.log("Database connection not authenticated".red.underline, error)
    process.exit(1)
  }
}


module.exports = connectDB