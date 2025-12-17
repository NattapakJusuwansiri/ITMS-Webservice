const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('requestActionLog', {
    requestActionLogId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'RequestActionLogId'
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
    actionLogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ActionLog',
        key: 'ActionLogId'
      },
      field: 'ActionLogId'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Comment'
    },
    flowStepId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'FlowStep',
        key: 'FlowStepId'
      },
      field: 'FlowStepId'
    },
    masterFlowStepId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'MasterFlowStep',
        key: 'MasterFlowStepId'
      },
      field: 'MasterFlowStepId'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            