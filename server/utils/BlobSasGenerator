const { StorageSharedKeyCredential, generateBlobSASQueryParameters, ContainerSASPermissions } = require('@azure/storage-blob');

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!accountName || !accountKey || !containerName) {
  throw new Error("Azure Blob Storage environment variables are not set.");
}

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

const generateSasToken = (permissions) => {
  try {
    const expiresOn = new Date(new Date().valueOf() + 60 * 60 * 1000); // 1 hour

    const sasToken = generateBlobSASQueryParameters({
      containerName,
      expiresOn,
      permissions: ContainerSASPermissions.parse(permissions),
    }, sharedKeyCredential).toString();

    return sasToken;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  generateSasToken
}