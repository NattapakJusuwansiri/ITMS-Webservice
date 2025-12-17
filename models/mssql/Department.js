const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('department', {
    departmentId: {
      type: DataTypes.STRING(250),
      allowNull: false,
      primaryKey: true,
      field: 'DepartmentId'
    },
    orgStructureId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'OrgStructure',
        key: 'OrgStructureId'
      },
      field: 'OrgStructureId'
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Name'
    },
    parentId: {
      type: DataTypes.STRING(250),
      allowNull: true,
      references: {
        model: 'Department',
        key: 'DepartmentId'
      },
      field: 'ParentId'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'IsActive'
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Code'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            