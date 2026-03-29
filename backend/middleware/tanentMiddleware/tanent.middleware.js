const { Footsal } = require("../../models");

const resolveFutsalTenant = async(req, res, next)=> {
  try {
    const futsalId = Number(req.params.futsalId || req.body.futsalId || req.query.futsalId);
    if (!Number.isInteger(futsalId)) {
      return res.status(400).json({ message: "Invalid futsalId" });
    }

    let futsal = await Footsal.findByPk(futsalId, {
      attributes: ["id", "futsalCode", "isActive"]
    });

    if (!futsal) {
      futsal = await Footsal.findOne({
        where: { futsalCode: futsalId },
        attributes: ["id", "futsalCode", "isActive"],
      });
    }

    if (!futsal || !futsal.isActive) {
      return res.status(404).json({ message: "Futsal not found" });
    }

    const code = String(futsal.futsalCode);
    if (!/^\d+$/.test(code)) {
      return res.status(400).json({ message: "Invalid futsalCode" });
    }

    req.tenant = { futsalId: futsal.id, code };
    req.tanent = req.tenant;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = resolveFutsalTenant