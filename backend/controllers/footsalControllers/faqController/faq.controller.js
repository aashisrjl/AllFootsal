const { sequelize, Footsal } = require("../../../models");
const { QueryTypes } = require("sequelize");

// Create FAQ - by futsal owner
const createFaq = async (req, res) => {
  const futsalCode = req.futsalCode;
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      success: false,
      message: "Question and answer are required",
    });
  }

  try {
    const [result] = await sequelize.query(
      `INSERT INTO faq_${futsalCode} (question, answer) VALUES (?, ?)`,
      {
        replacements: [question, answer],
        type: QueryTypes.INSERT,
      }
    );

    return res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: { id: result, question, answer },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error creating FAQ",
      error: err.message,
    });
  }
};

// Get FAQs for a specific futsal - Public
const getFaqs = async (req, res) => {
  const futsalId = req.params.futsalId;

  try {
    const futsal = await Footsal.findOne({
      where: { id: futsalId },
      attributes: ["futsalCode"],
    });

    if (!futsal) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found",
      });
    }

    const code = futsal.futsalCode;
    const faqs = await sequelize.query(
      `SELECT * FROM faq_${code} WHERE is_active = TRUE ORDER BY created_at DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      success: true,
      message: "FAQs retrieved successfully",
      data: faqs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving FAQs",
      error: err.message,
    });
  }
};

// Update FAQ - by futsal owner
const updateFaq = async (req, res) => {
  const futsalCode = req.futsalCode;
  const faqId = req.params.faqId;
  const { question, answer, is_active } = req.body;

  try {
    const [updated] = await sequelize.query(
      `UPDATE faq_${futsalCode} SET question = ?, answer = ?, is_active = ? WHERE id = ?`,
      {
        replacements: [question, answer, is_active !== undefined ? is_active : true, faqId],
        type: QueryTypes.UPDATE,
      }
    );

    if (updated === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found or no changes made",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating FAQ",
      error: err.message,
    });
  }
};

// Delete FAQ - by futsal owner
const deleteFaq = async (req, res) => {
  const futsalCode = req.futsalCode;
  const faqId = req.params.faqId;

  try {
    const [deleted] = await sequelize.query(
      `DELETE FROM faq_${futsalCode} WHERE id = ?`,
      {
        replacements: [faqId],
        type: QueryTypes.DELETE,
      }
    );

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error deleting FAQ",
      error: err.message,
    });
  }
};

module.exports = {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
};
