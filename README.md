# QRGen - QR Code Generator API

A serverless Azure Functions API for generating QR codes with flexible configuration options. This project provides a simple, production-ready HTTP endpoint that can be easily integrated into any application requiring QR code generation capabilities.

## 🎯 What This Project Does

QRGen is an HTTP-triggered Azure Function that generates QR codes from text input. It accepts requests via GET or POST methods and returns QR codes in multiple formats (Data URL, PNG buffer, or SVG). The API is designed to be:

- **Easy to integrate**: Simple REST API that works with any HTTP client
- **Flexible**: Multiple output formats and customization options
- **Production-ready**: Proper error handling, CORS support, and validation
- **Serverless**: Built on Azure Functions for automatic scaling and minimal maintenance

## 📋 Features

- ✅ Generate QR codes from any text string
- ✅ Multiple output formats: Data URL, PNG, SVG
- ✅ Customizable QR code size
- ✅ Configurable error correction levels (L, M, Q, H)
- ✅ Custom colors for dark and light areas
- ✅ CORS support for cross-origin requests
- ✅ Support for both GET and POST requests
- ✅ Comprehensive error handling and validation
- ✅ JSON response format for easy parsing

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v12 or higher)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) (for local development)
- An Azure account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/richardthorek/QRGen.git
cd QRGen
```

2. Install dependencies:
```bash
npm install
```

3. Start the local development server:
```bash
npm start
```

The function will be available at `http://localhost:7071/api/QRGEN`

## 📖 API Documentation

### Endpoint

```
GET/POST /api/QRGEN
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `text` | string | Yes | - | Text to encode in the QR code |
| `format` | string | No | `dataURL` | Output format: `dataURL`, `png`, or `svg` |
| `size` | integer | No | `300` | QR code size in pixels |
| `errorCorrectionLevel` | string | No | `M` | Error correction: `L` (7%), `M` (15%), `Q` (25%), or `H` (30%) |
| `darkColor` | string | No | `#000000` | Hex color code for dark modules |
| `lightColor` | string | No | `#FFFFFF` | Hex color code for light modules |

### Request Examples

#### Basic GET Request

```bash
curl "http://localhost:7071/api/QRGEN?text=Hello%20World"
```

#### GET Request with Options

```bash
curl "http://localhost:7071/api/QRGEN?text=https://example.com&size=500&errorCorrectionLevel=H&format=png" --output qrcode.png
```

#### POST Request

```bash
curl -X POST http://localhost:7071/api/QRGEN \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello World",
    "size": 400,
    "errorCorrectionLevel": "Q",
    "format": "dataURL"
  }'
```

#### JavaScript/Fetch Example

```javascript
// Using fetch API
const response = await fetch('http://localhost:7071/api/QRGEN', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'https://example.com',
    size: 300,
    errorCorrectionLevel: 'M',
    format: 'dataURL'
  })
});

const data = await response.json();
// Use data.dataURL in an <img> tag
```

#### Python Example

```python
import requests

response = requests.post('http://localhost:7071/api/QRGEN', json={
    'text': 'Hello from Python',
    'size': 300,
    'format': 'png'
})

# Save PNG to file
with open('qrcode.png', 'wb') as f:
    f.write(response.content)
```

### Response Examples

#### Success Response (Data URL format)

```json
{
  "dataURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

#### Success Response (PNG format)

Binary PNG image data with `Content-Type: image/png` header

#### Success Response (SVG format)

```xml
<svg xmlns="http://www.w3.org/2000/svg" ...>
  <!-- SVG content -->
</svg>
```

#### Error Response

```json
{
  "error": "Missing required parameter: text",
  "message": "Please provide text to encode in the QR code",
  "usage": {
    "method": "GET or POST",
    "parameters": { ... }
  }
}
```

## 🔧 Configuration

### Error Correction Levels

QR codes support four levels of error correction, allowing the code to be readable even if partially damaged:

- **L (Low)**: ~7% of codewords can be restored
- **M (Medium)**: ~15% of codewords can be restored (default)
- **Q (Quartile)**: ~25% of codewords can be restored
- **H (High)**: ~30% of codewords can be restored

Higher error correction levels create denser QR codes but provide better reliability.

### Output Formats

1. **dataURL**: Returns a JSON object with a base64-encoded Data URL. Best for web applications that want to display QR codes in `<img>` tags.

2. **png**: Returns raw PNG binary data. Best for saving to files or serving as images directly.

3. **svg**: Returns SVG markup. Best for scalable, vector-based QR codes that need to be displayed at various sizes.

## 🏗️ Project Structure

```
QRGen/
├── QRGEN/
│   ├── function.json      # Azure Function binding configuration
│   ├── index.js           # Main function handler
│   └── sample.dat         # Sample data file
├── .vscode/               # VS Code configuration
├── host.json              # Azure Functions host configuration
├── package.json           # Node.js dependencies
├── proxies.json           # Azure Functions proxies
└── README.md              # This file
```

## 🚢 Deployment

### Deploy to Azure

1. Install Azure Functions Core Tools:
```bash
npm install -g azure-functions-core-tools@3
```

2. Login to Azure:
```bash
az login
```

3. Create a Function App (if you haven't already):
```bash
az functionapp create --resource-group <resource-group> \
  --consumption-plan-location <location> \
  --runtime node \
  --runtime-version 14 \
  --functions-version 3 \
  --name <function-app-name> \
  --storage-account <storage-account>
```

4. Deploy:
```bash
func azure functionapp publish <function-app-name>
```

Your API will be available at: `https://<function-app-name>.azurewebsites.net/api/QRGEN`

## 🔐 Security

- The API has authentication level set to `anonymous` for easy integration. For production use, consider adding authentication.
- CORS is enabled for all origins (`*`). Restrict this in production by modifying the `Access-Control-Allow-Origin` header.
- Input validation is performed on all parameters to prevent malicious input.

## 🧪 Testing

Currently, there are no automated tests. To test manually:

1. Start the local server: `npm start`
2. Test with curl or your preferred HTTP client
3. Verify QR codes by scanning them with a QR code reader app

## 🤝 Integration Examples

### As Part of a Web Application

```html
<!DOCTYPE html>
<html>
<head>
  <title>QR Code Generator</title>
</head>
<body>
  <input type="text" id="text" placeholder="Enter text for QR code">
  <button onclick="generateQR()">Generate QR Code</button>
  <img id="qrcode" alt="QR Code will appear here">

  <script>
    async function generateQR() {
      const text = document.getElementById('text').value;
      const response = await fetch('http://localhost:7071/api/QRGEN', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, format: 'dataURL' })
      });
      const data = await response.json();
      document.getElementById('qrcode').src = data.dataURL;
    }
  </script>
</body>
</html>
```

### As Part of a REST API

```javascript
// Express.js example
const express = require('express');
const axios = require('axios');

app.get('/generate-ticket-qr', async (req, res) => {
  const ticketId = req.query.ticketId;
  const qrResponse = await axios.post('http://localhost:7071/api/QRGEN', {
    text: `TICKET:${ticketId}`,
    size: 400,
    errorCorrectionLevel: 'H',
    format: 'png'
  });
  
  res.contentType('image/png');
  res.send(qrResponse.data);
});
```

## 📝 Recommendations for Improvement

### Completed Improvements ✅
- Comprehensive documentation
- Support for multiple output formats
- Configurable QR code options (size, colors, error correction)
- Proper error handling and validation
- CORS support for cross-origin requests
- Support for both GET and POST requests
- JSDoc documentation in code

### Future Enhancements 🔮
- Add authentication/API key support for production use
- Implement rate limiting to prevent abuse
- Add automated tests (unit and integration)
- Support for QR code with embedded logos/images
- Batch QR code generation endpoint
- QR code analytics (track scans)
- Add TypeScript support for better type safety
- Implement caching for frequently generated QR codes
- Add webhook support for async generation
- Support for vCard, WiFi credentials, and other QR code types

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/richardthorek/QRGen/issues) on GitHub.

## 🙏 Acknowledgments

- Built with [node-qrcode](https://github.com/soldair/node-qrcode) library
- Powered by [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)
