const blobSasGenerator = require("../utils/BlobSasGenerator");

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

/**
 * Generate a SAS token for Azure Blob Storage
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {void} - Returns JSON with SAS token and storage URL
 */
const generateSasToken = (req, res) => {
  const sasToken = blobSasGenerator.generateSasToken("cwr");
  const containerName = req.query.containerName;
  res.json({
    sasToken,
    containerUrl: `https://${accountName}.blob.core.windows.net/${containerName}`,
  })
}

module.exports = {
  generateSasToken
};