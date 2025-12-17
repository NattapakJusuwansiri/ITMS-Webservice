const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('user', {
    userId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'UserId'
    },
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'Employee',
        key: 'EmployeeId'
      },
      field: 'EmployeeId'
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'Name'
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "UC_Username",
      field: 'Username'
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'Password'
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Role',
        key: 'RoleId'
      },
      field: 'RoleId'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'IsActive'
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'CreateDate'
    },
    updateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'UpdateDate'
    },
    createUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'UserId'
      },
      field: 'CreateUserId'
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
    isSystem: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'IsSystem'
    },
    externalEmail: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'ExternalEmail'
    },
    changePasswordKey: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: 'ChangePasswordKey'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            