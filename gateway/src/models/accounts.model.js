const AccountsModel = (sequelize, { DataTypes }) => {
  const Accounts = sequelize.define("accounts", {
    uid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    }
  },
  {
    freezeTableName: true
  });

  /*
  Accounts.associate = (models) => {

  };
*/
  return Accounts;
};

module.exports = AccountsModel;