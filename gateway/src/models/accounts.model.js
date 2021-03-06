const AccountsModel = (sequelize, { DataTypes }) => {
  const Accounts = sequelize.define(
    "accounts",
    {
      // UNIQUE NEAR account ID
      uid: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      // A: active I: Inactive D: deleted
      state: {
        type: DataTypes.ENUM("A", "I", "D"),
        allowNull: true,
      },
      // RQ: Requester, VL: Validator, XA: External App
      type: {
        type: DataTypes.ENUM("RQ", "VL", "XA"),
        allowNull: true,
      },
      // Account email
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      // Account Phone
      phone: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      // Encripted JSON account pub/priv keys
      keys: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      // Verification state, TRUE or FALSE
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // Subject ID, example: ar_dni_12345678, may be empty
      subject_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        // references: {
        //   model: "subjects",
        //   key: "id",
        // },

        // field:'ID',
        validate: {
          notEmpty: false,
        },
      },
      // A NEAR account ID linked to this account, used by validators to receive payments.
      linked_account_uid: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      freezeTableName: true,
      // timestamps: default(true) adds created_at, updated_at
      underscored: true,
    }
  );

  // Accounts.associate = (models) => {
  //   Accounts.hasOne(models.SubjectModel, {
  //     foreignKey: "id",
  //     sourceKey: "subject_id",
  //   });
  // };

  return Accounts;
};

module.exports = AccountsModel;
