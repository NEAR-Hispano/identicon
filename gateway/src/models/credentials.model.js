const CredentialModel = (sequelize, { DataTypes }) => {
  const Credentials = sequelize.define("credentials", {
    uid: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    token_id: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    subject_id: {
      type: DataTypes.STRING(100),
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
  });

  return Credentials;
};

module.exports = CredentialModel;
