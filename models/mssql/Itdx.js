const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('itdx', {
    dataId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'DataId'
    },
    projectName: {
      type: DataTypes.STRING(256),
      allowNull: false,
      field: 'ProjectName'
    },
    expectedDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'ExpectedDueDate'
    },
    currentOperationIssue: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'CurrentOperationIssue'
    },
    improvement: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'Improvement'
    },
    requirement: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'Requirement'
    },
    projectCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'ProjectCost'
    },
    benefitRoi: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'BenefitROI'
    },
    schedule: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'File',
        key: 'FileId'
      },
      field: 'Schedule'
    },
    note: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Note'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            