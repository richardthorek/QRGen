# QRGen Architecture & Technical Documentation

This document provides a technical overview of the QRGen project architecture, design decisions, and implementation details.

## 🏗️ Project Architecture

### Technology Stack

- **Runtime**: Node.js v12+
- **Platform**: Azure Functions (Serverless)
- **QR Library**: [node-qrcode](https://github.com/soldair/node-qrcode) v1.4.4
- **Trigger Type**: HTTP (REST API)
- **Language**: JavaScript (ES6+)

### Project Structure

```
QRGen/
├── QRGEN/                      # Azure Function directory
│   ├── function.json          # Function binding configuration
│   ├── index.js               # Main function handler (entry point)
│   └── sample.dat             # Sample data file
├── examples/                   # Integration examples
│   ├── README.md              # Examples documentation
│   ├── web-example.html       # Web interface example
│   ├── node-example.js        # Node.js integration examples
│   └── python-example.py      # Python integration examples
├── .vscode/                    # VS Code configuration
├── host.json                   # Azure Functions host config
├── package.json                # Node.js dependencies
├── README.md                   # Main documentation
├── API.md                      # API reference
├── CONTRIBUTING.md             # Contribution guidelines
├── QUICKSTART.md               # Quick start guide
└── ARCHITECTURE.md             # This file
```

## 🔄 Request Flow

```
Client Request
    ↓
Azure Functions HTTP Trigger
    ↓
Parameter Extraction (query string or POST body)
    ↓
Input Validation
    ↓
QR Code Generation (node-qrcode library)
    ↓
Format Conversion (dataURL/PNG/SVG)
    ↓
Response with Headers (CORS, Content-Type)
    ↓
Client Response
```

## 📝 Core Components

### 1. Function Handler (`QRGEN/index.js`)

**Purpose**: Main entry point for the Azure Function

**Responsibilities**:
- HTTP request handling
- Parameter extraction and validation
- QR code generation orchestration
- Error handling
- Response formatting
- CORS header management

**Key Features**:
- Supports both GET and POST methods
- Handles OPTIONS requests for CORS preflight
- Validates all input parameters
- Provides detailed error messages
- Returns responses in multiple formats

### 2. QR Code Generation

**Library**: `qrcode` npm package

**Supported Formats**:
- **Data URL**: Base64-encoded PNG embedded in a data URL
- **PNG Buffer**: Raw binary PNG image data
- **SVG**: Scalable Vector Graphics markup

**Configuration Options**:
- Size (width/height in pixels)
- Error correction level (L, M, Q, H)
- Colors (dark and light module colors)

### 3. Configuration Files

#### `function.json`
Defines the Azure Function bindings:
- HTTP trigger configuration
- Anonymous authentication level
- Support for GET and POST methods
- Input/output bindings

#### `host.json`
Azure Functions host configuration:
- Runtime version (2.0)
- Logging settings
- Extension bundle configuration

## 🔒 Security Considerations

### Current Implementation

1. **Authentication**: Anonymous (no authentication required)
   - Suitable for public APIs
   - Should be changed for production use

2. **CORS**: Enabled for all origins (`*`)
   - Allows cross-origin requests from any domain
   - Should be restricted in production

3. **Input Validation**: Comprehensive validation of all parameters
   - Checks for required fields
   - Validates enum values (error correction levels, formats)
   - Prevents injection attacks through proper encoding

4. **Error Handling**: Safe error messages
   - Doesn't expose internal implementation details
   - Provides helpful user-facing messages
   - Logs detailed errors for debugging

### Recommendations for Production

1. **Add Authentication**:
   - API keys
   - Azure AD integration
   - OAuth 2.0

2. **Implement Rate Limiting**:
   - Per IP address
   - Per API key
   - Per time window

3. **Restrict CORS**:
   - Whitelist specific domains
   - Configure per environment

4. **Add Input Sanitization**:
   - Limit text length
   - Sanitize special characters
   - Validate URLs if applicable

5. **Enable Monitoring**:
   - Application Insights
   - Request logging
   - Error tracking

## ⚡ Performance Considerations

### Current Performance Characteristics

- **Cold Start**: 1-3 seconds (Azure Functions consumption plan)
- **Warm Response**: < 100ms for simple QR codes
- **Memory Usage**: ~50MB base + ~5-10MB per concurrent request
- **CPU Usage**: Low (QR generation is not CPU-intensive)

### Optimization Opportunities

1. **Caching**:
   - Cache frequently generated QR codes
   - Use Redis or Azure Cache for Redis
   - Implement cache invalidation strategy

2. **CDN Integration**:
   - Serve static QR codes through CDN
   - Reduce function invocations
   - Improve global latency

3. **Batch Processing**:
   - Add batch endpoint for multiple QR codes
   - Reduce overhead for bulk operations

4. **Image Optimization**:
   - Compress PNG output
   - Optimize SVG output
   - Consider WebP format

## 🔄 Extensibility

The architecture is designed for easy extension:

### Adding New Output Formats

```javascript
case 'webp':
    // Add WebP support
    code = await QRCode.toWebP(text, options);
    context.res.headers['Content-Type'] = 'image/webp';
    context.res.body = code;
    break;
```

### Adding Custom QR Code Types

```javascript
// Helper functions for specific QR types
function createVCardQR(contact) {
    return `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
TEL:${contact.phone}
EMAIL:${contact.email}
END:VCARD`;
}
```

### Adding Middleware

```javascript
// Authentication middleware
async function authenticate(context, req) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || !isValidApiKey(apiKey)) {
        context.res.status = 401;
        context.res.body = { error: 'Unauthorized' };
        return false;
    }
    return true;
}
```

## 🧪 Testing Strategy

### Current State
- No automated tests implemented
- Manual testing performed

### Recommended Testing Approach

1. **Unit Tests**:
   - Test parameter validation
   - Test QR code generation with various options
   - Test error handling

2. **Integration Tests**:
   - Test HTTP endpoints
   - Test different request methods
   - Test CORS behavior

3. **End-to-End Tests**:
   - Test complete workflows
   - Verify QR codes can be scanned
   - Test with real clients

4. **Load Tests**:
   - Measure performance under load
   - Identify bottlenecks
   - Test scalability

### Testing Tools

Recommended tools:
- **Jest**: Unit testing framework
- **Supertest**: HTTP endpoint testing
- **Artillery**: Load testing
- **ZXing**: QR code validation

## 📊 Monitoring and Observability

### Logging

Current logging implementation:
- Request received logs
- Success logs with text preview
- Error logs with full error details

### Metrics to Track

1. **Request Metrics**:
   - Request count
   - Response time
   - Error rate
   - Success rate

2. **Usage Metrics**:
   - Popular QR code sizes
   - Most used error correction levels
   - Format distribution

3. **Performance Metrics**:
   - Function execution time
   - Memory usage
   - Cold start frequency

4. **Business Metrics**:
   - Total QR codes generated
   - Unique users
   - Geographic distribution

### Recommended Tools

- **Application Insights**: Azure native monitoring
- **Datadog**: Third-party APM
- **New Relic**: Performance monitoring
- **Prometheus + Grafana**: Custom metrics

## 🚀 Deployment Options

### 1. Azure Functions (Recommended)

**Pros**:
- Automatic scaling
- Pay per execution
- Integrated monitoring
- Easy CI/CD

**Cons**:
- Cold start latency
- Vendor lock-in

### 2. Docker Container

**Pros**:
- Portable
- Consistent environments
- No cold starts

**Cons**:
- Requires container orchestration
- Higher baseline cost

### 3. Traditional Server

**Pros**:
- Full control
- No cold starts
- Predictable costs

**Cons**:
- Manual scaling
- Higher operational overhead

## 🔮 Future Enhancements

### Short Term
1. Add authentication support
2. Implement rate limiting
3. Add automated tests
4. Add request logging and monitoring

### Medium Term
1. Batch QR code generation
2. QR code templates
3. Logo/image embedding
4. Advanced customization options

### Long Term
1. QR code analytics (scan tracking)
2. Dynamic QR codes (editable content)
3. Multi-region deployment
4. GraphQL API support
5. WebSocket support for real-time generation

## 🤝 Contributing to Architecture

When proposing architectural changes:

1. Consider backward compatibility
2. Document performance implications
3. Provide migration guides if needed
4. Update this document
5. Add tests for new functionality

## 📚 Additional Resources

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [node-qrcode Library](https://github.com/soldair/node-qrcode)
- [QR Code Specification](https://www.qrcode.com/en/about/standards.html)
- [REST API Best Practices](https://restfulapi.net/)

---

**Last Updated**: 2024
**Maintainers**: See CONTRIBUTING.md
