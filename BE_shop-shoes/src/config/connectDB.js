const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("shoe_store", "root", 'your_new_password', {
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
  port: 3306,
  // define: {
  //       timestamps: false
  //   }
});

let connectDB = async () => {
  try {
    await sequelize.authenticate(); // xac thuc astablished
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectDB;
