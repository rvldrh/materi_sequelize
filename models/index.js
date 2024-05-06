"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    if (file != "server.js") {
      const modelDefiner = require(__dirname + "/" + file);
      const model = modelDefiner(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// models/index.js

// ...

// Ubah definisi model ini menjadi "Book" (sesuai dengan yang Anda gunakan di file book.js)

// Ubah definisi model ini menjadi "DetailOfBorrow" (sesuai dengan yang Anda gunakan di file detail_of_borrow.js)

// ...

// Ubah hubungan ini menjadi "DetailOfBorrow" (sesuai dengan yang Anda gunakan di file detail_of_borrow.js)
db.Book.hasMany(db.DetailOfBorrow, {
  foreignKey: 'bookID',
  as: 'detail_of_borrow'
});

db.DetailOfBorrow.belongsTo(db.Book);

// ...


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
