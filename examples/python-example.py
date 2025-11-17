"""
Python Example - QR Code Generator Integration

This example demonstrates how to integrate QRGen API into a Python application.
Includes examples for Flask integration, file operations, and batch processing.
"""

import requests
import json
import base64
from typing import Dict, List, Optional
from pathlib import Path


# Configure the API endpoint
API_URL = "http://localhost:7071/api/QRGEN"


class QRCodeGenerator:
    """Client for QRGen API"""
    
    def __init__(self, api_url: str = API_URL):
        """
        Initialize the QR code generator client
        
        Args:
            api_url: Base URL for the QRGen API
        """
        self.api_url = api_url
    
    def generate_data_url(self, text: str, **options) -> str:
        """
        Generate a QR code and return as data URL
        
        Args:
            text: Text to encode in the QR code
            **options: Additional options (size, errorCorrectionLevel, etc.)
        
        Returns:
            Data URL string of the QR code
        
        Raises:
            requests.exceptions.RequestException: If the API request fails
        """
        payload = {
            'text': text,
            'format': 'dataURL',
            **options
        }
        
        response = requests.post(self.api_url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        return data['dataURL']
    
    def generate_file(self, text: str, filename: str, **options) -> None:
        """
        Generate a QR code and save as PNG file
        
        Args:
            text: Text to encode in the QR code
            filename: Output filename
            **options: Additional options (size, errorCorrectionLevel, etc.)
        """
        payload = {
            'text': text,
            'format': 'png',
            **options
        }
        
        response = requests.post(self.api_url, json=payload)
        response.raise_for_status()
        
        with open(filename, 'wb') as f:
            f.write(response.content)
        
        print(f"QR code saved to {filename}")
    
    def generate_svg(self, text: str, **options) -> str:
        """
        Generate a QR code and return as SVG
        
        Args:
            text: Text to encode in the QR code
            **options: Additional options (size, errorCorrectionLevel, etc.)
        
        Returns:
            SVG string of the QR code
        """
        payload = {
            'text': text,
            'format': 'svg',
            **options
        }
        
        response = requests.post(self.api_url, json=payload)
        response.raise_for_status()
        
        return response.text
    
    def generate_batch(self, items: List[Dict]) -> List[Dict]:
        """
        Generate multiple QR codes
        
        Args:
            items: List of dicts with 'text', 'filename', and optional 'options'
        
        Returns:
            List of results with success status
        """
        results = []
        
        for item in items:
            try:
                self.generate_file(
                    item['text'],
                    item['filename'],
                    **(item.get('options', {}))
                )
                results.append({
                    'success': True,
                    'filename': item['filename']
                })
            except Exception as e:
                results.append({
                    'success': False,
                    'filename': item['filename'],
                    'error': str(e)
                })
        
        return results


def example1_basic():
    """Example 1: Basic QR code generation"""
    print("\n=== Example 1: Basic QR Code ===")
    
    generator = QRCodeGenerator()
    data_url = generator.generate_data_url("Hello, World!")
    print(f"Data URL generated (first 100 chars): {data_url[:100]}...")


def example2_custom():
    """Example 2: QR code with custom options"""
    print("\n=== Example 2: Custom QR Code ===")
    
    generator = QRCodeGenerator()
    generator.generate_file(
        "https://github.com/richardthorek/QRGen",
        "github-qr.png",
        size=500,
        errorCorrectionLevel="H",
        darkColor="#0366d6",
        lightColor="#f6f8fa"
    )


def example3_wifi():
    """Example 3: QR code for WiFi credentials"""
    print("\n=== Example 3: WiFi QR Code ===")
    
    generator = QRCodeGenerator()
    wifi_string = "WIFI:T:WPA;S:MyNetwork;P:MyPassword;;"
    generator.generate_file(
        wifi_string,
        "wifi-qr.png",
        size=400,
        errorCorrectionLevel="H"
    )


def example4_vcard():
    """Example 4: QR code for contact vCard"""
    print("\n=== Example 4: vCard QR Code ===")
    
    vcard = """BEGIN:VCARD
VERSION:3.0
FN:John Doe
ORG:Example Corp
TEL:+1234567890
EMAIL:john.doe@example.com
URL:https://example.com
END:VCARD"""
    
    generator = QRCodeGenerator()
    generator.generate_file(
        vcard,
        "contact-qr.png",
        size=400,
        errorCorrectionLevel="M"
    )


def example5_batch():
    """Example 5: Batch generation"""
    print("\n=== Example 5: Batch Generation ===")
    
    generator = QRCodeGenerator()
    items = [
        {'text': 'https://example.com/page1', 'filename': 'page1-qr.png'},
        {'text': 'https://example.com/page2', 'filename': 'page2-qr.png'},
        {'text': 'https://example.com/page3', 'filename': 'page3-qr.png'}
    ]
    
    results = generator.generate_batch(items)
    print(f"Batch results: {results}")


def example6_flask():
    """Example 6: Flask integration"""
    print("\n=== Example 6: Flask Integration ===")
    print("Code snippet for Flask:")
    print("""
from flask import Flask, request, send_file, jsonify
import requests
from io import BytesIO

app = Flask(__name__)

@app.route('/generate-qr', methods=['POST'])
def generate_qr():
    try:
        data = request.get_json()
        text = data.get('text')
        options = {k: v for k, v in data.items() if k != 'text'}
        
        response = requests.post(
            'http://localhost:7071/api/QRGEN',
            json={'text': text, 'format': 'png', **options}
        )
        response.raise_for_status()
        
        return send_file(
            BytesIO(response.content),
            mimetype='image/png',
            as_attachment=True,
            download_name='qrcode.png'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
    """)


def example7_svg():
    """Example 7: SVG generation"""
    print("\n=== Example 7: SVG Generation ===")
    
    generator = QRCodeGenerator()
    svg = generator.generate_svg(
        "https://example.com",
        size=300,
        darkColor="#FF6B35",
        lightColor="#F7F7F7"
    )
    
    with open("qrcode.svg", "w") as f:
        f.write(svg)
    
    print("SVG QR code saved to qrcode.svg")


def example8_error_handling():
    """Example 8: Error handling"""
    print("\n=== Example 8: Error Handling ===")
    
    generator = QRCodeGenerator()
    
    # Test missing text parameter
    try:
        generator.generate_data_url("")
    except requests.exceptions.HTTPError as e:
        print("Caught expected error for missing text")
        print(f"Error details: {e.response.json()}")
    
    # Test invalid parameter
    try:
        generator.generate_data_url("Test", errorCorrectionLevel="INVALID")
    except requests.exceptions.HTTPError as e:
        print("\nCaught expected error for invalid parameter")
        print(f"Error details: {e.response.json()}")


def example9_advanced_usage():
    """Example 9: Advanced usage patterns"""
    print("\n=== Example 9: Advanced Usage ===")
    
    generator = QRCodeGenerator()
    
    # Generate QR code with brand colors
    print("Generating branded QR code...")
    generator.generate_file(
        "https://mybrand.com",
        "branded-qr.png",
        size=600,
        errorCorrectionLevel="H",
        darkColor="#FF6B35",
        lightColor="#F7F7F7"
    )
    
    # Generate event ticket QR
    print("Generating event ticket QR code...")
    ticket_data = json.dumps({
        'event': 'Concert 2024',
        'ticket': 'ABC123XYZ',
        'seat': 'A12',
        'date': '2024-12-31'
    })
    generator.generate_file(
        ticket_data,
        "ticket-qr.png",
        size=500,
        errorCorrectionLevel="H"
    )


def main():
    """Run all examples"""
    print("QRGen Python Examples")
    print("=====================")
    print(f"API Endpoint: {API_URL}")
    print("\nMake sure the QRGen function is running locally with 'npm start'\n")
    
    try:
        example1_basic()
        example2_custom()
        example3_wifi()
        example4_vcard()
        example5_batch()
        example6_flask()
        example7_svg()
        example8_error_handling()
        example9_advanced_usage()
        
        print("\n=== All Examples Completed ===")
        print("Check the generated files in the current directory.")
    except requests.exceptions.RequestException as e:
        print("\nFailed to run examples. Make sure the API is running.")
        print("Start it with: npm start")
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
