const config = require('../config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  config.database.name, 
  config.database.user, 
  config.database.pass, 
  {
    host: config.database.host,
    dialect: 'sqlite',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    storage: `${config.database.path}/${config.database.name}.sqlite`
  }
);

// db models
const AccountsModel = require('./accounts.model.js');
const FeaturesModel = require('./features.model.js');
const VerificationsModel = require('./verifications.model.js');
const TransactionsModel = require('./transactions.model.js');
const SubjectsModel = require('./subjects.model.js');
const SessionsModel = require('./sessions.model.js');

const models = {
  AccountsModel: AccountsModel(sequelize, Sequelize),
  FeaturesModel: FeaturesModel(sequelize, Sequelize),
  VerificationsModel: VerificationsModel(sequelize, Sequelize),
  TransactionsModel: TransactionsModel(sequelize, Sequelize),
  SubjectsModel: SubjectsModel(sequelize, Sequelize),
  SessionsModel: SessionsModel(sequelize, Sequelize)
}; 

// db relations
Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

const Op = Sequelize.Op;

module.exports = { sequelize, models, Op };
