# QRGen API Reference

Complete API documentation for the QRGen QR Code Generator.

## Base URL

- **Local Development**: `http://localhost:7071/api`
- **Production**: `https://<your-function-app>.azurewebsites.net/api`

## Endpoints

### Generate QR Code

Generate a QR code from text with customizable options.

#### Endpoint
```
GET|POST /QRGEN
```

#### Authentication
None (anonymous access). Consider adding authentication for production deployments.

#### Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | For POST requests |

---

## Parameters

### Request Parameters

All parameters can be provided either as query strings (GET) or in the JSON body (POST).

| Parameter | Type | Required | Default | Valid Values | Description |
|-----------|------|----------|---------|--------------|-------------|
| `text` | string | **Yes** | - | Any string | Text to encode in the QR code. Can be URLs, plain text, JSON, etc. |
| `format` | string | No | `dataURL` | `dataURL`, `png`, `svg` | Output format of the QR code |
| `size` | integer | No | `300` | 100-2000 | Size of the QR code in pixels (width and height) |
| `errorCorrectionLevel` | string | No | `M` | `L`, `M`, `Q`, `H` | Error correction level (see details below) |
| `darkColor` | string | No | `#000000` | Hex color | Color for dark modules (the QR code data) |
| `lightColor` | string | No | `#FFFFFF` | Hex color | Color for light modules (the background) |

### Error Correction Levels

| Level | Recovery Capacity | Use Case |
|-------|------------------|----------|
| `L` (Low) | ~7% | Clean environments, larger data capacity |
| `M` (Medium) | ~15% | General use (default) |
| `Q` (Quartile) | ~25% | Moderate durability needed |
| `H` (High) | ~30% | Harsh environments, maximum reliability |

---

## Response Formats

### Success Responses

#### Data URL Format (default)

**Status Code**: `200 OK`

**Content-Type**: `application/json`

**Body**:
```json
{
  "dataURL": "data:image/png;base64,iVBORw0KGgo..."
}
```

The `dataURL` can be directly used in HTML `<img>` tags:
```html
<img src="data:image/png;base64,iVBORw0KGgo..." alt="QR Code">
```

#### PNG Format

**Status Code**: `200 OK`

**Content-Type**: `image/png`

**Body**: Binary PNG image data

Save to file or display directly as an image.

#### SVG Format

**Status Code**: `200 OK`

**Content-Type**: `image/svg+xml`

**Body**: SVG XML markup
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <!-- SVG paths and shapes -->
</svg>
```

### Error Responses

#### Missing Required Parameter

**Status Code**: `400 Bad Request`

**Body**:
```json
{
  "error": "Missing required parameter: text",
  "message": "Please provide text to encode in the QR code",
  "usage": {
    "method": "GET or POST",
    "parameters": {
      "text": "Required - Text to encode in QR code",
      "format": "Optional - Output format: dataURL (default), png, svg",
      "size": "Optional - QR code size in pixels (default: 300)",
      "errorCorrectionLevel": "Optional - L, M (default), Q, or H",
      "darkColor": "Optional - Dark color hex code (default: #000000)",
      "lightColor": "Optional - Light color hex code (default: #FFFFFF)"
    }
  }
}
```

#### Invalid Error Correction Level

**Status Code**: `400 Bad Request`

**Body**:
```json
{
  "error": "Invalid error correction level",
  "message": "errorCorrectionLevel must be one of: L, M, Q, H"
}
```

#### Invalid Format

**Status Code**: `400 Bad Request`

**Body**:
```json
{
  "error": "Invalid format",
  "message": "Format must be one of: dataURL, png, svg"
}
```

#### Internal Server Error

**Status Code**: `500 Internal Server Error`

**Body**:
```json
{
  "error": "QR Code generation failed",
  "message": "Detailed error message"
}
```

---

## Request Examples

### cURL Examples

#### Basic Request
```bash
curl "http://localhost:7071/api/QRGEN?text=Hello%20World"
```

#### Request with All Options
```bash
curl "http://localhost:7071/api/QRGEN?text=https://example.com&size=500&errorCorrectionLevel=H&format=dataURL&darkColor=%23FF0000&lightColor=%23FFFF00"
```

#### Download PNG
```bash
curl "http://localhost:7071/api/QRGEN?text=https://example.com&format=png" --output qrcode.png
```

#### POST Request
```bash
curl -X POST http://localhost:7071/api/QRGEN \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello World",
    "size": 400,
    "errorCorrectionLevel": "Q",
    "format": "dataURL",
    "darkColor": "#0000FF",
    "lightColor": "#FFFFFF"
  }'
```

### JavaScript/Node.js Examples

#### Using Fetch API (Browser/Node 18+)
```javascript
async function generateQRCode(text, options = {}) {
  const response = await fetch('http://localhost:7071/api/QRGEN', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      ...options
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}

// Usage
const result = await generateQRCode('https://example.com', {
  size: 300,
  errorCorrectionLevel: 'M',
  format: 'dataURL'
});

console.log(result.dataURL);
```

#### Using Axios
```javascript
const axios = require('axios');

async function generateQRCode(text, options = {}) {
  const response = await axios.post('http://localhost:7071/api/QRGEN', {
    text: text,
    ...options
  });

  return response.data;
}

// Get PNG buffer
const response = await axios.post('http://localhost:7071/api/QRGEN', {
  text: 'Hello World',
  format: 'png'
}, {
  responseType: 'arraybuffer'
});

const fs = require('fs');
fs.writeFileSync('qrcode.png', response.data);
```

### Python Examples

#### Using Requests Library
```python
import requests

def generate_qr_code(text, **options):
    response = requests.post(
        'http://localhost:7071/api/QRGEN',
        json={
            'text': text,
            **options
        }
    )
    response.raise_for_status()
    return response

# Get Data URL
result = generate_qr_code('https://example.com', format='dataURL')
print(result.json()['dataURL'])

# Download PNG
result = generate_qr_code('Hello World', format='png', size=500)
with open('qrcode.png', 'wb') as f:
    f.write(result.content)
```

### PHP Examples

#### Using cURL
```php
<?php
function generateQRCode($text, $options = []) {
    $data = array_merge(['text' => $text], $options);
    
    $ch = curl_init('http://localhost:7071/api/QRGEN');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

$result = generateQRCode('https://example.com', [
    'size' => 300,
    'format' => 'dataURL'
]);

echo $result['dataURL'];
?>
```

### C# Examples

#### Using HttpClient
```csharp
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class QRCodeGenerator
{
    private static readonly HttpClient client = new HttpClient();

    public static async Task<string> GenerateQRCode(string text, object options = null)
    {
        var data = new
        {
            text = text,
            size = 300,
            format = "dataURL"
        };

        var json = JsonSerializer.Serialize(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await client.PostAsync(
            "http://localhost:7071/api/QRGEN",
            content
        );

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
}
```

---

## Use Cases

### 1. Website URLs
```json
{
  "text": "https://www.example.com",
  "errorCorrectionLevel": "M"
}
```

### 2. Contact Information (vCard)
```json
{
  "text": "BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD",
  "size": 400,
  "errorCorrectionLevel": "H"
}
```

### 3. WiFi Credentials
```json
{
  "text": "WIFI:T:WPA;S:MyNetwork;P:MyPassword;;",
  "errorCorrectionLevel": "H"
}
```

### 4. Event Ticket
```json
{
  "text": "{\"event\": \"Concert\", \"ticket\": \"ABC123\", \"seat\": \"A12\"}",
  "size": 500,
  "errorCorrectionLevel": "H"
}
```

### 5. Custom Branding
```json
{
  "text": "https://mybrand.com",
  "darkColor": "#FF6B35",
  "lightColor": "#F7F7F7",
  "errorCorrectionLevel": "H"
}
```

---

## Rate Limits

Currently, there are no rate limits implemented. For production use, consider implementing:

- Rate limiting per IP address
- API key authentication with usage quotas
- Request throttling based on Azure Functions consumption plan limits

---

## CORS Support

The API includes CORS headers allowing requests from any origin:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

For production, consider restricting the allowed origins.

---

## Best Practices

1. **Use POST for sensitive data**: While GET is convenient, use POST when the QR code contains sensitive information.

2. **Choose appropriate error correction**: Higher levels create denser QR codes but are more resilient.

3. **Optimize size**: Larger QR codes are easier to scan but consume more bandwidth. Balance based on use case.

4. **Cache generated codes**: If generating the same QR code repeatedly, cache the result to improve performance.

5. **Validate input**: Always validate and sanitize user input before passing to the API.

6. **Handle errors gracefully**: Implement proper error handling in your client code.

---

## Troubleshooting

### QR Code Won't Scan

- Increase the `size` parameter
- Use a higher `errorCorrectionLevel` (Q or H)
- Ensure sufficient contrast between dark and light colors
- Check that the text is properly encoded

### CORS Errors

- Verify the API is running and accessible
- Check browser console for specific CORS errors
- Ensure proper headers are set in requests

### Large Data Issues

- QR codes have data capacity limits
- For large data, consider using a URL shortener
- Higher error correction reduces data capacity

---

## Support

For issues, questions, or feature requests, please visit:
https://github.com/richardthorek/QRGen/issues
