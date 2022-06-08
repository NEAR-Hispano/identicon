const SessionsModel = (sequelize, { DataTypes }) => {
  const Sessions = sequelize.define('sessions', {
    // UNIQUE auto assigned UUID Session key
    key: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    // The generated PASSCODE for this Session
    passcode: {
      type: DataTypes.STRING(12),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    // Email or Phone used for signup or recovery
    contact: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    // RQ: Requester, VL: Validator, XA: External App
    type: {
      type: DataTypes.ENUM('RQ', 'VL', 'XA'),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    underscored: true
    // timestamps: default(true) adds created_at, updated_at
  });

  return Sessions;
};

module.exports = SessionsModel;
