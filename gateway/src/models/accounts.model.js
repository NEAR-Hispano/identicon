const AccountsModel = (sequelize, { DataTypes }) => {
  const Accounts = sequelize.define('accounts', {
    // UNIQUE NEAR account ID
    uid: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    // A: active I: Inactive D: deleted
    state: {
      type: DataTypes.ENUM('A', 'I', 'D'),
      allowNull: true,
    },
    // RQ: Requester, VL: Validator, APP: Application
    type: {
      type: DataTypes.ENUM('RQ', 'VL', 'APP'),
      allowNull: true,
    },
    // Account email
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },
    // Account Phone
    phone: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },
    // Encripted JSON account pub/priv keys
    keys: {
      type: DataTypes.BLOB,
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },
    // Verification state, TRUE or FALSE
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // Encripted JSON personal info
    personal_info: {
      type: DataTypes.BLOB,
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },
    // Subject ID, example: ar_dni_12345678, may be empty
    subject_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: false,
      }
    },
    // A NEAR account ID linked to this account, used by validators to receive payments.
    linked_account_uid: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    }
  },
  {
    freezeTableName: true,
    //timestamps: true,
    underscored: true
  });




  /*
  Accounts.associate = (models) => {

  };
*/
  return Accounts;
};

module.exports = AccountsModel;