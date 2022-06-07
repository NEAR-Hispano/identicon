const VerificationsModel = (sequelize, { DataTypes }) => {
  const Verifications = sequelize.define('verifications', {
    // UNIQUE request UUID
    request_uid: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    // Request type: ProofOfLife, ...
    type: {
      type: DataTypes.ENUM('ProofOfLife', 'ProofOfIdentity', 'ProofOfExistence', 'ProofOfState', 'ProofOfOwnership', 'ProofOfService'),
      allowNull: true,
    },
    // Subject ID, example: ar_dni_12345678, may be empty
    subject_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: false,
      }
    },
    // PN: Pending, ST: Started, FI: Finished
    state: {
      type: DataTypes.ENUM('PN', 'ST', 'FI'),
      allowNull: true,
    },
    // AP, RX, NP, WND, CX
    result: {
      type: DataTypes.ENUM('AP', 'RX', 'NP', 'WND', 'CX'),
      allowNull: true,
    },
    // Must start verification after UTC time stamp in ISO-8601 format
    must_start_utc: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: false,
      }
    },
    // Must end verification before UTC time stamp in ISO-8601 format
    must_end_utc: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: false,
      }
    },
  },
  {
    freezeTableName: true,
    //timestamps: true,
    underscored: true
  });





  Verifications.associate = (models) => {
    Verifications.belongsTo(models.AccountsModel);
  };

  return Verifications;
};

module.exports = VerificationsModel;