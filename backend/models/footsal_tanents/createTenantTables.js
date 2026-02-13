const sequelize = require("../index").sequelize;
const sqlTemplates = require("./sqlTemplates");

async function createTenantTables(footsalCode) {
  const queries = [
    sqlTemplates.location(footsalCode),
    sqlTemplates.pitch(footsalCode),
    sqlTemplates.timeslot(footsalCode),
    sqlTemplates.booking(footsalCode),
    sqlTemplates.payment(footsalCode),
    sqlTemplates.rating(footsalCode),
    sqlTemplates.contact(footsalCode),
    sqlTemplates.analytics(footsalCode),
  ];

  for (const query of queries) {
    await sequelize.query(query);
  }
}

module.exports = createTenantTables;
