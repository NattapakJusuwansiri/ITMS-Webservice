const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('masterFlowStep', {
    masterFlowStepId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'MasterFlowStepId'
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
    masterFlowId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'MasterFlow',
        key: 'MasterFlowId'
      },
      field: 'MasterFlowId'
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
      allowNull: true,
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
            