const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('departmentHead', {
    departmentHeadId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'DepartmentHeadId'
    },
    departmentId: {
      type: DataTypes.STRING(250),
      allowNull: false,
      references: {
        model: 'Department',
        key: 'DepartmentId'
      },
      field: 'DepartmentId'
    },
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'Employee',
        key: 'EmployeeId'
      },
      field: 'EmployeeId'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            