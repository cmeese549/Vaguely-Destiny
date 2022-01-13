const { DataTypes } = require('sequelize');

module.exports = {
    init,
    schema
};

function schema() {
  return({
    basicProperties: {
      type: DataTypes.JSON,
      allowNull: false
    },
    objectivesManifest: {
      type: DataTypes.JSON,
      allowNull: true
    },
    intervalInfoManifest: {
      type: DataTypes.JSON,
      allowNull: true
    },
    presentationNodeManifest: {
      type: DataTypes.JSON,
      allowNull: false
    },
    filterData: {
        type: DataTypes.JSON,
        allowNull: false
    }
  });
}

function init (sequelize) {
    const Record = sequelize.define('Record', 
    schema, {
      // Other model options go here
    });
}