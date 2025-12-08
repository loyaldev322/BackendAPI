const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Helper function to extract file ID from Google Drive URL
function extractFileId(url) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

// Helper function to convert Google Drive sharing link to direct download link
function getDirectDownloadLink(fileId) {
    // Add confirm=t to bypass virus scan warning for executable files
    return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
}

// GET API endpoint
app.get('/api', async (req, res) => {
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
            },
            responseType: 'text' // Ensure we get text content
        });

        // Get the content as text
        let content = response.data;

        // Check if we got HTML (virus scan warning page) instead of the actual file
        if (content.trim().startsWith('<!DOCTYPE html>') || content.includes('Google Drive can\'t scan this file')) {
            // Try alternative download method
            const altDownloadLink = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
            const altResponse = await axios.get(altDownloadLink, {
                maxRedirects: 5,
                validateStatus: function (status) {
                    return status >= 200 && status < 400;
                },
                responseType: 'text'
            });
            content = altResponse.data;
        }

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
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api`);
});

