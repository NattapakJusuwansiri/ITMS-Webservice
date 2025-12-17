const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('flowStep', {
    flowStepId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'FlowStepId'
    },
    flowStepTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FlowStepType',
        key: 'FlowStepTypeId'
      },
      field: 'FlowStepTypeId'
    },
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Request',
        key: 'RequestId'
      },
      field: 'RequestId'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'UserId'
      },
      field: 'UserId'
    },
    flowGroupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'FlowGroup',
        key: 'FlowGroupId'
      },
      field: 'FlowGroupId'
    },
    orderNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'OrderNo'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            