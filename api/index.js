const axios = require('axios');

function extractFileId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function getDirectDownloadLink(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ data: '', error: 'Method not allowed' });
  }

  try {
    const googleDriveLink = req.query.url || 'https://drive.google.com/file/d/16AaeeVhqj4Q6FlJIDMgdWASJvq7w00Yc/view?usp=sharing';
    const fileId = extractFileId(googleDriveLink);

    if (!fileId) {
      return res.status(400).json({ data: '', error: 'Invalid Google Drive URL' });
    }

    const downloadLink = getDirectDownloadLink(fileId);
    const response = await axios.get(downloadLink, {
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
      responseType: 'text',
    });

    let content = response.data;

    if (content.trim().startsWith('<!DOCTYPE html>') || content.includes("Google Drive can't scan this file")) {
      const altDownloadLink = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
      const altResponse = await axios.get(altDownloadLink, {
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400,
        responseType: 'text',
      });
      content = altResponse.data;
    }

    res.json({ data: content });
  } catch (error) {
    console.error('Error fetching from Google Drive:', error.message);
    res.status(500).json({ data: '', error: 'Failed to fetch data from Google Drive' });
  }
};
