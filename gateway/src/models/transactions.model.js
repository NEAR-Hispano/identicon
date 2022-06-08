const TransactionsModel = (sequelize, { DataTypes }) => {
  const Transactions = sequelize.define('transactions', {
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
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    // Transaction action: RQ; request, VL: validation, CL: conclusion
    action: {
      type: DataTypes.ENUM('RQ', 'VL', 'CL'),
      allowNull: true,
    },
    // Actor account uid which participated in this transaction
    actor_uid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    // Transaction UID in the BC
    tx_uid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    // JSON additional information from TX log
    tx_log: {
      type: DataTypes.TEXT('{}'),
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

  return Transactions;
};

module.exports = TransactionsModel;
