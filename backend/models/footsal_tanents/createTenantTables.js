const db = require('../index');

async function createTenantTables(footsalCode) {
  const { sequelize } = db;
  const templates = require('./sqlTemplates');

  const tableCreators = [
    'location', 'info', 'pitch', 'timeslot',
    'booking', 'payment', 'rating', 'contact', 'analytics','media','visitor'
  ];

  for (const name of tableCreators) {
    await sequelize.query(templates[name](footsalCode));
  }
}

async function dropTenantTables(footsalCode) {
  const { sequelize } = db;
  const tables = [
    'analytics', 'contact', 'rating', 'payment',
    'booking', 'timeslot', 'pitch', 'info', 'location', 'media', 'visitor'
  ];

  for (const name of tables) {
    await sequelize.query(`DROP TABLE IF EXISTS ${name}_${footsalCode}`);
  }
}

module.exports = { createTenantTables, dropTenantTables };