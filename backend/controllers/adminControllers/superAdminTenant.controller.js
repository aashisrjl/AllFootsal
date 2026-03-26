const { QueryTypes } = require("sequelize");
const { sequelize, Footsal } = require("../../models");
const {
  createTenantTables,
  dropTenantTables,
} = require("../../models/footsal_tanents/createTenantTables");

const TENANT_TABLE_PREFIXES = [
  "location",
  "info",
  "pitch",
  "timeslot",
  "booking",
  "payment",
  "rating",
  "contact",
  "analytics",
  "media",
  "visitor",
];

const ensureSuperAdmin = (req, res) => {
  const configuredKey = process.env.SUPER_ADMIN_API_KEY;
  const requestKey = req.headers["x-super-admin-key"];

  if (!configuredKey) {
    res.status(500).json({
      success: false,
      message: "SUPER_ADMIN_API_KEY is not configured",
    });
    return false;
  }

  if (!requestKey || requestKey !== configuredKey) {
    res.status(401).json({
      success: false,
      message: "Unauthorized super admin request",
    });
    return false;
  }

  return true;
};

const getNormalizedFutsalCode = (input) => {
  const code = String(input || "").trim();
  if (!/^\d+$/.test(code)) return null;
  return code;
};

const getExistingTenantTableSet = async (futsalCode) => {
  const expectedTables = TENANT_TABLE_PREFIXES.map(
    (prefix) => `${prefix}_${futsalCode}`
  );

  const dialect = sequelize.getDialect();

  if (dialect === "postgres") {
    const rows = await sequelize.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public'
         AND table_name IN (:expectedTables)`,
      {
        replacements: { expectedTables },
        type: QueryTypes.SELECT,
      }
    );

    return new Set(rows.map((row) => row.table_name));
  }

  if (dialect === "mysql" || dialect === "mariadb") {
    const rows = await sequelize.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = DATABASE()
         AND table_name IN (:expectedTables)`,
      {
        replacements: { expectedTables },
        type: QueryTypes.SELECT,
      }
    );

    return new Set(rows.map((row) => row.TABLE_NAME || row.table_name));
  }

  const found = new Set();
  for (const tableName of expectedTables) {
    try {
      await sequelize.query(`SELECT 1 FROM ${tableName} LIMIT 1`, {
        type: QueryTypes.SELECT,
      });
      found.add(tableName);
    } catch (error) {
      continue;
    }
  }
  return found;
};

const listTenantsByFutsalCode = async (req, res) => {
  try {
    if (!ensureSuperAdmin(req, res)) return;

    const futsals = await Footsal.findAll({
      attributes: [
        "id",
        "futsalCode",
        "futsalName",
        "email",
        "phoneNumber",
        "ownerName",
        "isActive",
        "isVerified",
      ],
      order: [["futsalCode", "ASC"]],
    });

    const tenantRows = await Promise.all(
      futsals.map(async (futsal) => {
        const futsalCode = String(futsal.futsalCode);
        const existing = await getExistingTenantTableSet(futsalCode);

        const tables = TENANT_TABLE_PREFIXES.map((prefix) => {
          const tableName = `${prefix}_${futsalCode}`;
          return {
            tableName,
            exists: existing.has(tableName),
          };
        });

        return {
          futsal: futsal.toJSON(),
          tenantSummary: {
            totalExpectedTables: TENANT_TABLE_PREFIXES.length,
            existingTables: tables.filter((table) => table.exists).length,
            missingTables: tables.filter((table) => !table.exists).length,
          },
          tables,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Tenants fetched by futsal code",
      data: tenantRows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tenants",
      error: error.message,
    });
  }
};

const getTenantByFutsalCode = async (req, res) => {
  try {
    if (!ensureSuperAdmin(req, res)) return;

    const futsalCode = getNormalizedFutsalCode(req.params.futsalCode);
    if (!futsalCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid futsalCode",
      });
    }

    const futsal = await Footsal.findOne({ where: { futsalCode } });
    if (!futsal) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found for this futsalCode",
      });
    }

    const existing = await getExistingTenantTableSet(futsalCode);

    const tableStats = await Promise.all(
      TENANT_TABLE_PREFIXES.map(async (prefix) => {
        const tableName = `${prefix}_${futsalCode}`;
        if (!existing.has(tableName)) {
          return {
            tableName,
            exists: false,
            records: 0,
          };
        }

        const rows = await sequelize.query(
          `SELECT COUNT(*) AS total FROM ${tableName}`,
          {
            type: QueryTypes.SELECT,
          }
        );

        return {
          tableName,
          exists: true,
          records: Number(rows[0]?.total || 0),
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Tenant details fetched",
      data: {
        futsal: futsal.toJSON(),
        tables: tableStats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tenant details",
      error: error.message,
    });
  }
};

const createTenantForFutsalCode = async (req, res) => {
  try {
    if (!ensureSuperAdmin(req, res)) return;

    const futsalCode = getNormalizedFutsalCode(req.params.futsalCode);
    if (!futsalCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid futsalCode",
      });
    }

    const futsal = await Footsal.findOne({ where: { futsalCode } });
    if (!futsal) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found for this futsalCode",
      });
    }

    await createTenantTables(futsalCode);

    return res.status(201).json({
      success: true,
      message: "Tenant tables created successfully",
      data: {
        futsalCode,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create tenant tables",
      error: error.message,
    });
  }
};

const dropTenantForFutsalCode = async (req, res) => {
  try {
    if (!ensureSuperAdmin(req, res)) return;

    const futsalCode = getNormalizedFutsalCode(req.params.futsalCode);
    if (!futsalCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid futsalCode",
      });
    }

    const futsal = await Footsal.findOne({ where: { futsalCode } });
    if (!futsal) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found for this futsalCode",
      });
    }

    await dropTenantTables(futsalCode);

    return res.status(200).json({
      success: true,
      message: "Tenant tables dropped successfully",
      data: {
        futsalCode,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to drop tenant tables",
      error: error.message,
    });
  }
};

module.exports = {
  listTenantsByFutsalCode,
  getTenantByFutsalCode,
  createTenantForFutsalCode,
  dropTenantForFutsalCode,
};
