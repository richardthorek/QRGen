# QRGen Quick Start Guide

Get started with QRGen in 5 minutes!

## 🚀 Fastest Way to Get Started

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the API
```bash
npm start
```

The API will be available at: `http://localhost:7071/api/QRGEN`

### Step 3: Generate Your First QR Code

#### Option A: Using cURL
```bash
curl "http://localhost:7071/api/QRGEN?text=Hello%20World"
```

#### Option B: Using Your Browser
Open your browser and go to:
```
http://localhost:7071/api/QRGEN?text=Hello%20World
```

#### Option C: Download as PNG
```bash
curl "http://localhost:7071/api/QRGEN?text=Hello&format=png" --output my-qrcode.png
```

## 📱 Using the Web Interface

1. Open `examples/web-example.html` in your browser
2. Enter your text
3. Customize options (optional)
4. Click "Generate QR Code"
5. Download your QR code!

## 🔧 Common Use Cases

### Generate a URL QR Code
```bash
curl "http://localhost:7071/api/QRGEN?text=https://github.com&size=500"
```

### Generate a WiFi QR Code
```bash
curl "http://localhost:7071/api/QRGEN?text=WIFI:T:WPA;S:MyNetwork;P:MyPassword;;" --output wifi.png
```

### Custom Colors
```bash
curl "http://localhost:7071/api/QRGEN?text=MyBrand&darkColor=%23FF6B35&lightColor=%23F7F7F7&format=png" --output branded.png
```

## 📚 Next Steps

- Read the [full README](README.md) for detailed documentation
- Check out the [API Reference](API.md) for all available options
- Explore the [examples directory](examples/) for integration patterns
- Learn how to [deploy to Azure](README.md#-deployment)

## 💡 Pro Tips

1. **High Error Correction**: Use `errorCorrectionLevel=H` for QR codes that might be partially covered or damaged
2. **Larger Size**: Use `size=500` or higher for printed QR codes
3. **Test Scanning**: Always test your QR codes with a real scanner before production use
4. **Data URL Format**: Use `format=dataURL` for displaying QR codes directly in web pages
5. **PNG Format**: Use `format=png` for downloading or saving QR codes

## 🆘 Troubleshooting

### "func: not found" error
Install Azure Functions Core Tools:
```bash
npm install -g azure-functions-core-tools@3
```

### Port 7071 already in use
Stop other processes using the port or change the port in `host.json`

### QR Code won't scan
- Increase the size: add `&size=500`
- Use high error correction: add `&errorCorrectionLevel=H`
- Ensure good contrast between colors

## 🔗 Useful Links

- [Full Documentation](README.md)
- [API Reference](API.md)
- [Examples](examples/README.md)
- [Contributing Guide](CONTRIBUTING.md)
- [GitHub Repository](https://github.com/richardthorek/QRGen)

---

**Need help?** [Open an issue](https://github.com/richardthorek/QRGen/issues) on GitHub!
