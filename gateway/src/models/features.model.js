const FeaturesModel = (sequelize, { DataTypes }) => {
  const Features = sequelize.define("features", {
    uid: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },    
    comune: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },
    coords: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },
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