const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('policy', {
    policyId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'PolicyId'
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'Title'
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'Description'
    },
    policytypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PolicyType',
        key: 'PolicyTypeId'
      },
      field: 'PolicytypeId'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'IsActive'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            