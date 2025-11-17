# QRGen Examples

This directory contains practical examples demonstrating how to integrate the QRGen API into various applications and workflows.

## Available Examples

### 1. Web Example (`web-example.html`)

A complete, ready-to-use web interface for generating QR codes.

**Features:**
- Interactive form with all QR code options
- Real-time color picker
- Download functionality
- Responsive design
- Error handling

**How to use:**
1. Make sure the QRGen API is running (`npm start` from the root directory)
2. Open `web-example.html` in your web browser
3. Enter text and customize options
4. Click "Generate QR Code"

**To deploy this web interface:**
- Update the `API_URL` constant in the HTML file to point to your deployed Azure Function
- Host the HTML file on any web server or static hosting service

### 2. Node.js Example (`node-example.js`)

Comprehensive Node.js examples covering various integration patterns.

**Prerequisites:**
```bash
npm install axios
```

**Examples included:**
- Basic QR code generation
- Custom styling and colors
- WiFi credential QR codes
- vCard contact QR codes
- Batch processing
- Express.js integration
- Error handling

**How to run:**
```bash
# Make sure the API is running first
npm start

# In another terminal, run the examples
node examples/node-example.js
```

**Integration in your Node.js app:**
```javascript
const { generateQRFile, generateQRDataURL } = require('./node-example');

// Generate a QR code file
await generateQRFile('https://example.com', 'output.png', {
    size: 500,
    errorCorrectionLevel: 'H'
});

// Get a data URL
const dataURL = await generateQRDataURL('Hello World');
```

### 3. Python Example (`python-example.py`)

Complete Python examples with a reusable client class.

**Prerequisites:**
```bash
pip install requests
```

**Examples included:**
- QRCodeGenerator client class
- Basic and advanced usage
- WiFi and vCard QR codes
- SVG generation
- Flask integration
- Batch processing
- Comprehensive error handling

**How to run:**
```bash
# Make sure the API is running first
npm start

# In another terminal, run the examples
python examples/python-example.py
```

**Integration in your Python app:**
```python
from python_example import QRCodeGenerator

generator = QRCodeGenerator()

# Generate QR code file
generator.generate_file(
    'https://example.com',
    'output.png',
    size=500,
    errorCorrectionLevel='H'
)

# Get data URL
data_url = generator.generate_data_url('Hello World')
```

## Common Use Cases

### WiFi QR Code

Share WiFi credentials easily by encoding them in a QR code.

**Format:**
```
WIFI:T:<WPA|WEP|>;S:<SSID>;P:<password>;;
```

**Example:**
```javascript
// JavaScript
const wifiQR = await generateQR('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;');

# Python
generator.generate_file('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;', 'wifi.png')
```

### Contact vCard

Create a QR code for contact information.

**Format:**
```
BEGIN:VCARD
VERSION:3.0
FN:Full Name
TEL:Phone Number
EMAIL:email@example.com
END:VCARD
```

### Event Tickets

Encode ticket information in JSON format.

**Example:**
```json
{
  "event": "Concert 2024",
  "ticket": "ABC123",
  "seat": "A12",
  "date": "2024-12-31"
}
```

### URL Shortening Integration

For long URLs, consider integrating with a URL shortener first:

```javascript
// Pseudo-code
const shortUrl = await shortenUrl(longUrl);
const qrCode = await generateQR(shortUrl);
```

## Testing the Examples

### 1. Start the API
```bash
cd /path/to/QRGen
npm install
npm start
```

The API will be available at `http://localhost:7071/api/QRGEN`

### 2. Test with cURL

```bash
# Basic test
curl "http://localhost:7071/api/QRGEN?text=Hello"

# Download PNG
curl "http://localhost:7071/api/QRGEN?text=Test&format=png" -o test.png

# POST request
curl -X POST http://localhost:7071/api/QRGEN \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","size":400}'
```

### 3. Run Language-Specific Examples

See individual example instructions above.

## Customization Tips

### Branding Your QR Codes

Use custom colors that match your brand:

```javascript
{
  "text": "https://yourbrand.com",
  "darkColor": "#FF6B35",  // Your brand color
  "lightColor": "#F7F7F7",  // Light background
  "errorCorrectionLevel": "H"  // High for brand visibility
}
```

### Optimizing for Print

For printed QR codes:
- Use high error correction level (H)
- Larger size (500px+)
- High contrast colors
- Test scanning from expected distance

```javascript
{
  "text": "https://example.com",
  "size": 800,
  "errorCorrectionLevel": "H",
  "darkColor": "#000000",
  "lightColor": "#FFFFFF"
}
```

### Optimizing for Mobile

For mobile app integration:
- Medium size (300-400px)
- Medium error correction (M or Q)
- Consider using Data URL format for inline display

```javascript
{
  "text": "https://example.com",
  "size": 300,
  "errorCorrectionLevel": "M",
  "format": "dataURL"
}
```

## Production Considerations

When deploying these examples to production:

1. **Update API URLs**: Change `localhost` URLs to your deployed Azure Function endpoint

2. **Add Authentication**: Implement API key or OAuth authentication

3. **Rate Limiting**: Add client-side rate limiting to prevent abuse

4. **Error Handling**: Implement comprehensive error handling and user feedback

5. **Caching**: Cache frequently generated QR codes

6. **Input Validation**: Validate and sanitize all user input before sending to API

7. **HTTPS**: Always use HTTPS in production

8. **CORS**: Configure appropriate CORS settings for your domains

## Troubleshooting

### API Connection Issues

**Problem**: Cannot connect to the API
**Solution**: 
- Verify the API is running: `npm start`
- Check the API URL in examples matches your setup
- Ensure no firewall blocking localhost:7071

### QR Code Won't Scan

**Problem**: Generated QR code cannot be scanned
**Solution**:
- Increase the size parameter
- Use higher error correction level
- Ensure good contrast between dark and light colors
- Test with different QR code scanner apps

### CORS Errors (Web Example)

**Problem**: CORS errors in browser console
**Solution**:
- API includes CORS headers by default
- If issues persist, check browser console for details
- Ensure API is running and accessible

## Additional Resources

- [Main README](../README.md) - Project overview and setup
- [API Documentation](../API.md) - Complete API reference
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute
- [QR Code Specification](https://www.qrcode.com/en/about/standards.html)
- [Azure Functions Docs](https://docs.microsoft.com/en-us/azure/azure-functions/)

## Need Help?

If you encounter issues with these examples:
1. Check that the API is running (`npm start`)
2. Verify your dependencies are installed
3. Review the error messages carefully
4. Open an issue on [GitHub](https://github.com/richardthorek/QRGen/issues)

## Contributing Examples

Have a great example to share? We welcome contributions!

1. Create your example file
2. Add documentation to this README
3. Test thoroughly
4. Submit a pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
