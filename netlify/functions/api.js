const axios = require('axios');

function extractFileId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function getDirectDownloadLink(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ data: '', error: 'Method not allowed' }),
    };
  }

  try {
    const query = event.queryStringParameters || {};
    const googleDriveLink =
      query.url ||
      'https://drive.google.com/file/d/16AaeeVhqj4Q6FlJIDMgdWASJvq7w00Yc/view?usp=sharing';
    const fileId = extractFileId(googleDriveLink);

    if (!fileId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ data: '', error: 'Invalid Google Drive URL' }),
      };
    }

    const downloadLink = getDirectDownloadLink(fileId);
    const response = await axios.get(downloadLink, {
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
      responseType: 'text',
    });

    let content = response.data;

    if (
      content.trim().startsWith('<!DOCTYPE html>') ||
      content.includes("Google Drive can't scan this file")
    ) {
      const altDownloadLink = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
      const altResponse = await axios.get(altDownloadLink, {
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400,
        responseType: 'text',
      });
      content = altResponse.data;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data: content }),
    };
  } catch (error) {
    console.error('Error fetching from Google Drive:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        data: '',
        error: 'Failed to fetch data from Google Drive',
      }),
    };
  }
};
