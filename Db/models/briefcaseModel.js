import { Model, DataTypes, Sequelize } from 'sequelize';

const BRIEFCASE_TABLE = 'briefcases';

const briefcaseSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  type: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  place: {
    allowNull: false,
    type: DataTypes.STRING
  },
  crime: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  dateCrime: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  placeCrime: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  nameDefendant: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  nameComplainant: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  lawyerDefendant: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  lawyerComplainant: {
    allowNull: false,
    type: DataTypes.STRING,
  },
}

class Briefcase extends Model {
  static associate() {
    // associate
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: BRIEFCASE_TABLE,
      modelName: 'Briefcase',
      timestamps: false
    }
  }
}


export { BRIEFCASE_TABLE, briefcaseSchema, Briefcase };
