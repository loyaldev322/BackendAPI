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

// Vercel serverless function
module.exports = async (req, res) => {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      data: '',
      error: 'Method not allowed'
    });
  }

  try {
    // Google Drive link - you can also make this configurable via query parameter
    const googleDriveLink = req.query.url || 'https://drive.google.com/file/d/16AaeeVhqj4Q6FlJIDMgdWASJvq7w00Yc/view?usp=sharing';
    
    // Extract file ID from the Google Drive URL
    const fileId = extractFileId(googleDriveLink);
    
    if (!fileId) {
      return res.status(400).json({
        data: '',
        error: 'Invalid Google Drive URL'
      });
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
    res.json({
      data: content
    });

  } catch (error) {
    console.error('Error fetching from Google Drive:', error.message);
    res.status(500).json({
      data: '',
      error: 'Failed to fetch data from Google Drive'
    });
  }
};

