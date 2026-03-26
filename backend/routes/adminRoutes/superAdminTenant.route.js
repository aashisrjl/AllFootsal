const express = require("express");
const {
  listTenantsByFutsalCode,
  getTenantByFutsalCode,
  createTenantForFutsalCode,
  dropTenantForFutsalCode,
} = require("../../controllers/adminControllers/superAdminTenant.controller");

const router = express.Router();

router.get(
  "/super-admin/tenants", // #swagger.tags=['SuperAdmin']
  listTenantsByFutsalCode
);

router.get(
  "/super-admin/tenants/:futsalCode", // #swagger.tags=['SuperAdmin']

  getTenantByFutsalCode
);

router.post(
  "/super-admin/tenants/:futsalCode/create", // #swagger.tags=['SuperAdmin']

  createTenantForFutsalCode
);

router.post(
  "/super-admin/tenants/create/:futsalCode", // #swagger.tags=['SuperAdmin']
  createTenantForFutsalCode
);

router.delete(
  "/super-admin/tenants/:futsalCode/drop", // #swagger.tags=['SuperAdmin']
  dropTenantForFutsalCode
);

router.delete(
  "/super-admin/tenants/drop/:futsalCode", // #swagger.tags=['SuperAdmin']
  dropTenantForFutsalCode
);

module.exports = router;
