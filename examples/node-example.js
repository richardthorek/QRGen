/**
 * Node.js Example - QR Code Generator Integration
 * 
 * This example demonstrates how to integrate QRGen API into a Node.js application.
 * It shows various usage patterns including Express.js integration, error handling,
 * and file operations.
 */

const axios = require('axios');
const fs = require('fs').promises;

// Configure the API endpoint
const API_URL = 'http://localhost:7071/api/QRGEN';

/**
 * Generate a QR code and return the data URL
 * @param {string} text - Text to encode
 * @param {Object} options - QR code options
 * @returns {Promise<string>} Data URL of the QR code
 */
async function generateQRDataURL(text, options = {}) {
    try {
        const response = await axios.post(API_URL, {
            text,
            format: 'dataURL',
            ...options
        });

        return response.data.dataURL;
    } catch (error) {
        console.error('Error generating QR code:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Generate a QR code and save as PNG file
 * @param {string} text - Text to encode
 * @param {string} filename - Output filename
 * @param {Object} options - QR code options
 */
async function generateQRFile(text, filename, options = {}) {
    try {
        const response = await axios.post(API_URL, {
            text,
            format: 'png',
            ...options
        }, {
            responseType: 'arraybuffer'
        });

        await fs.writeFile(filename, response.data);
        console.log(`QR code saved to ${filename}`);
    } catch (error) {
        console.error('Error generating QR code file:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Generate multiple QR codes in batch
 * @param {Array<Object>} items - Array of {text, filename, options}
 */
async function generateBatchQRCodes(items) {
    const results = [];

    for (const item of items) {
        try {
            await generateQRFile(item.text, item.filename, item.options || {});
            results.push({ success: true, filename: item.filename });
        } catch (error) {
            results.push({ success: false, filename: item.filename, error: error.message });
        }
    }

    return results;
}

// Example 1: Basic QR code generation
async function example1_basic() {
    console.log('\n=== Example 1: Basic QR Code ===');
    const dataURL = await generateQRDataURL('Hello, World!');
    console.log('Data URL generated (first 100 chars):', dataURL.substring(0, 100) + '...');
}

// Example 2: QR code with custom options
async function example2_custom() {
    console.log('\n=== Example 2: Custom QR Code ===');
    await generateQRFile('https://github.com/richardthorek/QRGen', 'github-qr.png', {
        size: 500,
        errorCorrectionLevel: 'H',
        darkColor: '#0366d6',
        lightColor: '#f6f8fa'
    });
}

// Example 3: QR code for WiFi credentials
async function example3_wifi() {
    console.log('\n=== Example 3: WiFi QR Code ===');
    const wifiString = 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;';
    await generateQRFile(wifiString, 'wifi-qr.png', {
        size: 400,
        errorCorrectionLevel: 'H'
    });
}

// Example 4: QR code for contact vCard
async function example4_vcard() {
    console.log('\n=== Example 4: vCard QR Code ===');
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:John Doe
ORG:Example Corp
TEL:+1234567890
EMAIL:john.doe@example.com
URL:https://example.com
END:VCARD`;

    await generateQRFile(vcard, 'contact-qr.png', {
        size: 400,
        errorCorrectionLevel: 'M'
    });
}

// Example 5: Batch generation
async function example5_batch() {
    console.log('\n=== Example 5: Batch Generation ===');
    const items = [
        { text: 'https://example.com/page1', filename: 'page1-qr.png' },
        { text: 'https://example.com/page2', filename: 'page2-qr.png' },
        { text: 'https://example.com/page3', filename: 'page3-qr.png' }
    ];

    const results = await generateBatchQRCodes(items);
    console.log('Batch results:', results);
}

// Example 6: Express.js integration
function example6_express() {
    console.log('\n=== Example 6: Express.js Integration ===');
    console.log('Code snippet for Express.js:');
    console.log(`
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Endpoint to generate QR code for a URL
app.post('/generate-qr', async (req, res) => {
    try {
        const { text, ...options } = req.body;
        
        const response = await axios.post('${API_URL}', {
            text,
            format: 'png',
            ...options
        }, {
            responseType: 'arraybuffer'
        });

        res.contentType('image/png');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
    `);
}

// Example 7: Error handling
async function example7_errorHandling() {
    console.log('\n=== Example 7: Error Handling ===');
    
    try {
        // This should fail - missing required parameter
        await generateQRDataURL('');
    } catch (error) {
        console.log('Caught expected error for missing text');
        if (error.response) {
            console.log('Error details:', error.response.data);
        }
    }

    try {
        // This should fail - invalid error correction level
        await generateQRDataURL('Test', { errorCorrectionLevel: 'INVALID' });
    } catch (error) {
        console.log('Caught expected error for invalid parameter');
        if (error.response) {
            console.log('Error details:', error.response.data);
        }
    }
}

// Main function to run all examples
async function main() {
    console.log('QRGen Node.js Examples');
    console.log('======================');
    console.log(`API Endpoint: ${API_URL}`);
    console.log('\nMake sure the QRGen function is running locally with "npm start"\n');

    try {
        // Run examples
        await example1_basic();
        await example2_custom();
        await example3_wifi();
        await example4_vcard();
        await example5_batch();
        example6_express();
        await example7_errorHandling();

        console.log('\n=== All Examples Completed ===');
        console.log('Check the generated PNG files in the current directory.');
    } catch (error) {
        console.error('\nFailed to run examples. Make sure the API is running.');
        console.error('Start it with: npm start');
        console.error('Error:', error.message);
    }
}

// Export functions for use in other modules
module.exports = {
    generateQRDataURL,
    generateQRFile,
    generateBatchQRCodes
};

// Run examples if executed directly
if (require.main === module) {
    main();
}
