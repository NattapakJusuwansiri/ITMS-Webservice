const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('employee', {
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      field: 'EmployeeId'
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Name'
    },
    nameEn: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'NameEN'
    },
    email: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Email'
    },
    isHead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'IsHead'
    },
    departmentId: {
      type: DataTypes.STRING(250),
      allowNull: true,
      references: {
        model: 'Department',
        key: 'DepartmentId'
      },
      field: 'DepartmentId'
    },
    idCard: {
      type: DataTypes.STRING(25),
      allowNull: true,
      field: 'IdCard'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'IsActive'
    },
    positionLevelId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'PositionLevel',
        key: 'PositionLevelId'
      },
      field: 'PositionLevelId'
    },
    positionId: {
      type: DataTypes.STRING(250),
      allowNull: true,
      references: {
        model: 'Position',
        key: 'PositionId'
      },
      field: 'PositionId'
    },
    reportToId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'Employee',
        key: 'EmployeeId'
      },
      field: 'ReportToId'
    },
    birthDayDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'BirthDayDate'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            