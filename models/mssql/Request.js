const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('request', {
    requestId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'RequestId'
    },
    requestTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'RequestType',
        key: 'RequestTypeId'
      },
      field: 'RequestTypeId'
    },
    dataId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ITDX',
        key: 'DataId'
      },
      field: 'DataId'
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Status',
        key: 'StatusId'
      },
      field: 'StatusId'
    },
    masterFlowId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'MasterFlow',
        key: 'MasterFlowId'
      },
      field: 'MasterFlowId'
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
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'RequestDate'
    },
    updateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'UpdateDate'
    },
    updateUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'UserId'
      },
      field: 'UpdateUserId'
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'CreateDate'
    },
    createUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'UserId'
      },
      field: 'CreateUserId'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            