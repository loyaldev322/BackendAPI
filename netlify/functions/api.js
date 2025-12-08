const axios = require('axios');

// Helper function to extract file ID from Google Drive URL
function extractFileId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Helper function to convert Google Drive sharing link to direct download link
function getDirectDownloadLink(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Netlify serverless function
exports.handler = async (event, context) => {
  // Enable CORS for all origins
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        data: '',
        error: 'Method not allowed'
      })
    };
  }

  try {
    // Get query parameters
    const queryParams = event.queryStringParameters || {};
    
    // Google Drive link - you can also make this configurable via query parameter
    const googleDriveLink = queryParams.url || 'https://drive.google.com/file/d/16AaeeVhqj4Q6FlJIDMgdWASJvq7w00Yc/view?usp=sharing';
    
    // Extract file ID from the Google Drive URL
    const fileId = extractFileId(googleDriveLink);
    
    if (!fileId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          data: '',
          error: 'Invalid Google Drive URL'
        })
      };
    }

    // Convert to direct download link
    const downloadLink = getDirectDownloadLink(fileId);
    
    // Fetch the content from Google Drive
    const response = await axios.get(downloadLink, {
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects
      }
    });

    // Get the content as text
    const content = response.data;

    // Return in the specified format
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: content
      })
    };

  } catch (error) {
    console.error('Error fetching from Google Drive:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        data: '',
        error: 'Failed to fetch data from Google Drive'
      })
    };
  }
};

