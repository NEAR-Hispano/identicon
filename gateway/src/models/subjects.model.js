const SubjectsModel = (sequelize, { DataTypes }) => {
  const Subjects = sequelize.define('subjects', {
    // UNIQUE NEAR account ID
    subject_id: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      unique: true,
      allowNull: false,
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
  },
  {
    freezeTableName: true,
    // timestamps: default(true) adds created_at, updated_at
    underscored: true
  });

  // Subjects.associate = (models) => {
  //   Subjects.belongsTo(models.AccountsModel, {foreignKey: 'uid'});
  // };

  return Subjects;
};

module.exports = SubjectsModel;
