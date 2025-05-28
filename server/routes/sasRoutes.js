const express = require('express');
const router = express.Router();
const { generateSasToken } = require('../controllers/sasController');

// GET /api/sas/token - Get a SAS token for accessing Azure Blob Storage
router.get('/token', generateSasToken);

module.exports = router;