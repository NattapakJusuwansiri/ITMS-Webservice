const { DataTypes } = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
const sequelize = require('.');

const Model = sequelize.define('orgStructure', {
    orgStructureId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'OrgStructureId'
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Name'
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Level'
    }
  }, {
    freezeTableName: true,
  createdAt: false,
  updatedAt: false
}
);
sequelizePaginate.paginate(Model);

module.exports = Model;
            