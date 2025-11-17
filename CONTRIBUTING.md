# Contributing to QRGen

Thank you for considering contributing to QRGen! This document provides guidelines and instructions for contributing to this project.

## 🎯 How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue on GitHub with:

- A clear, descriptive title
- Detailed steps to reproduce the issue
- Expected behavior vs. actual behavior
- Your environment (Node.js version, OS, Azure Functions version)
- Any relevant logs or error messages

### Suggesting Enhancements

Enhancement suggestions are welcome! Please create an issue with:

- A clear description of the enhancement
- Why this enhancement would be useful
- Example use cases
- Any potential implementation ideas

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines below
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description of your changes

## 🛠️ Development Setup

1. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/QRGen.git
cd QRGen
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. The function will be available at `http://localhost:7071/api/QRGEN`

## 📝 Code Style Guidelines

### JavaScript Style

- Use `const` and `let` instead of `var`
- Use async/await instead of callbacks or raw promises
- Add JSDoc comments for functions
- Use meaningful variable and function names
- Keep functions focused and single-purpose
- Handle errors appropriately with try-catch blocks

### Example:

```javascript
/**
 * Validates QR code input parameters
 * @param {string} text - Text to encode
 * @param {number} size - QR code size
 * @returns {Object} Validation result with isValid and error properties
 */
function validateInput(text, size) {
    if (!text) {
        return { isValid: false, error: 'Text is required' };
    }
    if (size < 100 || size > 2000) {
        return { isValid: false, error: 'Size must be between 100 and 2000' };
    }
    return { isValid: true };
}
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add SVG output format support
fix: correct error handling for invalid color codes
docs: update API documentation with new examples
```

## 🧪 Testing

Currently, this project doesn't have automated tests. When adding tests:

1. Place test files in a `test/` or `__tests__/` directory
2. Use a testing framework like Jest or Mocha
3. Aim for high code coverage
4. Test both success and error cases

Example test structure:
```javascript
describe('QR Code Generation', () => {
    test('should generate QR code with valid text', async () => {
        // Test implementation
    });
    
    test('should return error for missing text parameter', async () => {
        // Test implementation
    });
});
```

## 📋 Pull Request Checklist

Before submitting a pull request, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Comments and documentation are updated
- [ ] Changes have been tested locally
- [ ] No unnecessary files are included (node_modules, .DS_Store, etc.)
- [ ] Commit messages follow the conventional commits format
- [ ] README is updated if adding new features
- [ ] New dependencies are justified and documented

## 🔍 Code Review Process

1. A maintainer will review your pull request
2. They may request changes or ask questions
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged in the project

## 💡 Development Tips

### Local Testing

Test different scenarios:

```bash
# Test basic QR code generation
curl "http://localhost:7071/api/QRGEN?text=Hello"

# Test with options
curl "http://localhost:7071/api/QRGEN?text=Test&size=500&format=png" --output test.png

# Test error handling
curl "http://localhost:7071/api/QRGEN"  # Missing text parameter
```

### Debugging

Add logging statements:
```javascript
context.log('Debug info:', variable);
context.log.error('Error occurred:', error);
```

View logs in the terminal where `npm start` is running.

### Azure Functions Resources

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Functions JavaScript Guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node)
- [node-qrcode Documentation](https://github.com/soldair/node-qrcode)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- Be respectful and considerate
- Welcome diverse perspectives
- Accept constructive criticism gracefully
- Focus on what's best for the project
- Show empathy towards others

## 📞 Questions?

If you have questions about contributing, feel free to:

- Open an issue with the `question` label
- Reach out to the maintainers
- Check existing issues and documentation first

## 🙏 Thank You!

Every contribution, no matter how small, is valuable and appreciated. Thank you for helping make QRGen better!
