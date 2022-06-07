const FeaturesModel = (sequelize, { DataTypes }) => {
  const Features = sequelize.define('features', {
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
    // Country code
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },
    // Region code
    region: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },   
    // Comune code 
    comune: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },
    // GPS Coordinates obtained usinng address
    coords: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },
    // Comma separated list of language codes
    idioms: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });




  /*
  Accounts.associate = (models) => {

  };
*/
  return Features;
};

module.exports = FeaturesModel;