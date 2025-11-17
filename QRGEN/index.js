const QRCode = require('qrcode');

/**
 * Azure Function HTTP trigger for QR Code generation
 * Supports both GET and POST requests with flexible configuration options
 * 
 * @param {Object} context - Azure Functions context object
 * @param {Object} req - HTTP request object
 * @returns {Promise<void>} Sets context.res with the generated QR code or error
 * 
 * @example
 * GET /api/QRGEN?text=Hello%20World
 * GET /api/QRGEN?text=Hello&size=300&errorCorrectionLevel=H&format=dataURL
 * POST /api/QRGEN with body: { "text": "Hello World", "size": 300 }
 */
module.exports = async function (context, req) {
    context.log('QR Code generation request received');
    
    // Enable CORS for broader API usage
    context.res = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        return;
    }

    try {
        // Extract parameters from query string or POST body
        const text = req.query.text || (req.body && req.body.text);
        const format = req.query.format || (req.body && req.body.format) || 'dataURL';
        const size = parseInt(req.query.size || (req.body && req.body.size) || '300');
        const errorCorrectionLevel = req.query.errorCorrectionLevel || 
                                      (req.body && req.body.errorCorrectionLevel) || 'M';
        const darkColor = req.query.darkColor || (req.body && req.body.darkColor) || '#000000';
        const lightColor = req.query.lightColor || (req.body && req.body.lightColor) || '#FFFFFF';

        // Validate required parameter
        if (!text) {
            context.res.status = 400;
            context.res.body = {
                error: 'Missing required parameter: text',
                message: 'Please provide text to encode in the QR code',
                usage: {
                    method: 'GET or POST',
                    parameters: {
                        text: 'Required - Text to encode in QR code',
                        format: 'Optional - Output format: dataURL (default), png, svg',
                        size: 'Optional - QR code size in pixels (default: 300)',
                        errorCorrectionLevel: 'Optional - L, M (default), Q, or H',
                        darkColor: 'Optional - Dark color hex code (default: #000000)',
                        lightColor: 'Optional - Light color hex code (default: #FFFFFF)'
                    }
                }
            };
            return;
        }

        // Validate error correction level
        const validLevels = ['L', 'M', 'Q', 'H'];
        if (!validLevels.includes(errorCorrectionLevel)) {
            context.res.status = 400;
            context.res.body = {
                error: 'Invalid error correction level',
                message: `errorCorrectionLevel must be one of: ${validLevels.join(', ')}`
            };
            return;
        }

        // Configure QR code options
        const options = {
            errorCorrectionLevel: errorCorrectionLevel,
            type: 'image/png',
            width: size,
            color: {
                dark: darkColor,
                light: lightColor
            }
        };

        let code;

        // Generate QR code in requested format
        switch (format.toLowerCase()) {
            case 'dataurl':
                code = await QRCode.toDataURL(text, options);
                context.res.body = { dataURL: code };
                break;
            
            case 'png':
                code = await QRCode.toBuffer(text, options);
                context.res.headers['Content-Type'] = 'image/png';
                context.res.body = code;
                break;
            
            case 'svg':
                code = await QRCode.toString(text, { ...options, type: 'svg' });
                context.res.headers['Content-Type'] = 'image/svg+xml';
                context.res.body = code;
                break;
            
            default:
                context.res.status = 400;
                context.res.body = {
                    error: 'Invalid format',
                    message: 'Format must be one of: dataURL, png, svg'
                };
                return;
        }

        context.res.status = 200;
        context.log(`QR Code generated successfully for text: ${text.substring(0, 50)}...`);

    } catch (err) {
        context.log.error('QR Code generation error:', err);
        context.res.status = 500;
        context.res.body = {
            error: 'QR Code generation failed',
            message: err.message
        };
    }
}