const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('policyDeteil', {
    policyDeteilId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'PolicyDeteilId'
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
    orderNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'OrderNo'
    },
    policyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Policy',
        key: 'PolicyId'
      },
      field: 'PolicyId'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            