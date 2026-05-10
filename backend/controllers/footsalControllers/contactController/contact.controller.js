const { sequelize, User, Footsal } = require("../../../models");
const { QueryTypes } = require("sequelize");
const { createFutsalNotification } = require("../../../services/notifications/notificationService");

// user/public -> create contact message for a futsal
const createContact = async (req, res) => {
  try {
    const futsalId = req.params?.futsalId;
    if (!futsalId) {
      return res.status(400).json({
        success: false,
        message: "futsalId is required",
      });
    }

    const userId = req.userId;
    if (!futsalId) {
      return res.status(400).json({
        success: false,
        message: "futsalId is required",
      });
    }

    const futsal = await Footsal.findOne({ where: { id: futsalId } });
    if (!futsal) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found",
      });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const code = futsal.futsalCode;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }


    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const result = await sequelize.query(
      `INSERT INTO contact_${code} (name, email, phone, message, is_read)
       VALUES (:name, :email, :phone, :message, :isRead)`,
      {
        replacements: {
          name: user.username || "Anonymous",
          email: user.email || null,
          phone: user.phoneNumber || null,
          message,
          isRead: false,
        },
        type: QueryTypes.INSERT,
      }
    );

    // Notify the futsal owner about the new message
    createFutsalNotification({
      futsalId: futsal.id,
      type: "new_message",
      title: "New Message Received 💬",
      message: `${user.username || 'A user'} sent you a message: "${message.substring(0, 80)}${message.length > 80 ? '...' : ''}"`,
      relatedId: result[0],
      relatedType: "contact",
    }).catch(err => console.error("Failed to create futsal notification:", err));

    return res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// owner/admin -> list contact messages
const getContacts = async (req, res) => {
  try {
    const code = req.futsalCode;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }

    // Auto-create contact table if it does not exist yet
    await sequelize.query(
      `CREATE TABLE IF NOT EXISTS contact_${code} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(150),
        phone VARCHAR(20),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB`
    ).catch(() => {});

    const contacts = await sequelize.query(
      `SELECT * FROM contact_${code} ORDER BY created_at DESC`,
      { type: QueryTypes.SELECT }
    );

    return res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      data: contacts,
    });
  } catch (error) {
    console.error("getContacts error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// owner/admin -> mark contact as read
const markContactAsRead = async (req, res) => {
  try {
    const code = req.futsalCode;
    const contactId = req.params?.contactId;

    if (!code || !contactId) {
      return res.status(400).json({
        success: false,
        message: "futsal code and contactId are required",
      });
    }

    const result = await sequelize.query(
      `UPDATE contact_${code} SET is_read = true WHERE id = :contactId`,
      {
        replacements: { contactId },
        type: QueryTypes.UPDATE,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Contact marked as read",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// owner/admin -> delete contact message
const deleteContact = async (req, res) => {
  try {
    const code = req.futsalCode;
    const contactId = req.params?.contactId;

    if (!code || !contactId) {
      return res.status(400).json({
        success: false,
        message: "futsal code and contactId are required",
      });
    }

    const result = await sequelize.query(
      `DELETE FROM contact_${code} WHERE id = :contactId`,
      {
        replacements: { contactId },
        type: QueryTypes.DELETE,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  markContactAsRead,
  deleteContact,
};

