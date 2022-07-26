const { VerificationStates, ValidationTypes } = require('./definitions');

const TasksModel = (sequelize, { DataTypes }) => {

  const Tasks = sequelize.define('tasks', {
    // UNIQUE auto assigned UUID
    uid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    // Request UID
    request_uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    // Validator UID
    validator_uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    type: {
      type: DataTypes.ENUM(ValidationTypes),
      allowNull: true,
    },
    state: {
      type: DataTypes.ENUM(VerificationStates),
      allowNull: true,
    },
    // AP, RX, NP, WND, CX
    result: {
      type: DataTypes.ENUM(VerificationStates),
      allowNull: true,
    },
    contents: {
      type: DataTypes.TEXT, // JSON stringified array of Files
      allowNull: true,
      validate: {
        notEmpty: false,
      }
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        notEmpty: false,
      }
    },
  },
  {
    freezeTableName: true,
    // timestamps: default(true) adds created_at, updated_at
    underscored: true
  });

  return Tasks;
};

module.exports = TasksModel;
