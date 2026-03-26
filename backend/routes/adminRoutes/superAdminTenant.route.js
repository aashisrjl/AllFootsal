const express = require("express");
const {
  listTenantsByFutsalCode,
  getTenantByFutsalCode,
  createTenantForFutsalCode,
  dropTenantForFutsalCode,
} = require("../../controllers/adminControllers/superAdminTenant.controller");

const router = express.Router();

router.get(
  "/super-admin/tenants",
  listTenantsByFutsalCode
);

router.get(
  "/super-admin/tenants/:futsalCode",
  getTenantByFutsalCode
);

router.post(
  "/super-admin/tenants/:futsalCode/create",
  createTenantForFutsalCode
);

router.post(
  "/super-admin/tenants/create/:futsalCode",
  createTenantForFutsalCode
);

router.delete(
  "/super-admin/tenants/:futsalCode/drop",
  dropTenantForFutsalCode
);

router.delete(
  "/super-admin/tenants/drop/:futsalCode",
  dropTenantForFutsalCode
);

module.exports = router;
