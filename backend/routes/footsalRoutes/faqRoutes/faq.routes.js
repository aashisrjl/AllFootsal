const express = require('express');
const isFutsalAuthenticated = require('../../../middleware/authMiddleware/futsalAuthenticated');
const { createFaq, getFaqs, updateFaq, deleteFaq } = require('../../../controllers/footsalControllers/faqController/faq.controller');
const router = express.Router();

// Create FAQ - for futsal owner
router.post(
    '/futsal/faq/create', // #swagger.tags=["Futsal/Tenant/FAQ"]
    isFutsalAuthenticated,
    createFaq
);

// Get FAQs for a specific futsal - Public
router.get(
    '/futsal/:futsalId/faqs', // #swagger.tags=["Futsal/Tenant/FAQ"]
    getFaqs
);

// Update FAQ - for futsal owner
router.put(
    '/futsal/faq/:faqId', // #swagger.tags=["Futsal/Tenant/FAQ"]
    isFutsalAuthenticated,
    updateFaq
);

// Delete FAQ - for futsal owner
router.delete(
    '/futsal/faq/:faqId', // #swagger.tags=["Futsal/Tenant/FAQ"]
    isFutsalAuthenticated,
    deleteFaq
);

module.exports = router;
