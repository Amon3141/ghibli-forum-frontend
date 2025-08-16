'use client';
import { useState } from "react";
import { api } from '@/utils/api';

import { BlockBlobClient } from "@azure/storage-blob";

interface UseFileUploadReturn {
  handleUploadFile: (blobName: string, file: File, fileType?: string[]) => Promise<{blobUrl: string, sasToken: string} | null>,
  uploadMessage: string | null,
  setUploadMessage: (message: string | null) => void,
}

export default function useFileUpload(): UseFileUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleUploadFile = async (
    blobName: string,
    file: File,
    fileType?: string[]
  ): Promise<{blobUrl: string, sasToken: string} | null> => {
    if (fileType && !fileType.includes(file.type)) {
      setUploadMessage("Please select a valid image file");
      return null;
    }

    try {
      const containerName = 'images';
      const response = await api.get(`/sas/token?containerName=${containerName}`);
      const { sasToken, containerUrl } = response.data;

      const blobUrl = `${containerUrl}/${blobName}`;
      const blockBlobClient = new BlockBlobClient(`${blobUrl}?${sasToken}`);
      const uploadResponse = await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: {
          blobContentType: file.type,
        }
      });
      setUploadMessage(`Successfully uploaded ${file.name}`);

      setSelectedFile(null);
      return {blobUrl, sasToken};
    } catch (error) {
      setUploadMessage(`Error uploading ${selectedFile?.name}`);
      console.error('Error uploading image:', error);
      return null;
    }
  }

  return ({
    handleUploadFile,
    uploadMessage,
    setUploadMessage,
  })
}