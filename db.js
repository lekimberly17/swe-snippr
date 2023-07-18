const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:'); // Substitute with your own connection string

class Snippet extends Model {}

Snippet.init({
  language: DataTypes.STRING,
  code: DataTypes.TEXT
}, { sequelize, modelName: 'snippet' });

module.exports = {
  Snippet,
  // Add other models as needed
};
