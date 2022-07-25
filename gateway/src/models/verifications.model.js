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
    // UNIQUE NEAR account ID
    account_uid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // Subject ID, example: ar_dni_12345678, may be empty
    subject_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: false,
      }
    },
    // 
    state: {
      type: DataTypes.ENUM(
        'Unassigned','Pending', 'Approved', 'Rejected', 
        'NotPossible', 'WillNotDo', 'Canceled'
      ),
      allowNull: true,
    },
    // AP, RX, NP, WND, CX
    result: {
      type: DataTypes.ENUM(
        'Unassigned','Pending', 'Approved', 'Rejected', 
        'NotPossible', 'WillNotDo', 'Canceled'
      ),
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
    underscored: true
    // timestamps: default(true) adds created_at, updated_at
  });

  Verifications.associate = (models) => {
    Verifications.belongsTo(models.AccountsModel);
  };

  Verifications.state = {
    UNASSIGNED: 'Unassigned'
  }; 

  return Verifications;
};

module.exports = VerificationsModel;