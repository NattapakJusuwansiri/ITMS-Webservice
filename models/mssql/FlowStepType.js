const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('flowStepType', {
    flowStepTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'FlowStepTypeId'
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'Name'
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Description'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            