module.exports = async function resolveFutsalTenant(req, res, next) {
  try {
    const futsalId = Number(req.params.futsalId || req.body.futsalId);
    if (!Number.isInteger(futsalId)) {
      return res.status(400).json({ message: "Invalid futsalId" });
    }

    const futsal = await Footsal.findByPk(futsalId, {
      attributes: ["id", "futsalCode", "isActive"]
    });

    if (!futsal || !futsal.isActive) {
      return res.status(404).json({ message: "Futsal not found" });
    }

    const code = String(futsal.futsalCode);
    if (!/^\d+$/.test(code)) {
      return res.status(400).json({ message: "Invalid futsalCode" });
    }

    req.tenant = { futsalId: futsal.id, code };
    next();
  } catch (err) {
    next(err);
  }
};