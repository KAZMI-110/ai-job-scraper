try {
    const pdf = require('pdf-parse');
    console.log('PDFParse type:', typeof pdf.PDFParse);
    console.log('PDFParse keys:', Object.keys(pdf.PDFParse || {}));
    
    // Test if it works
    const fs = require('fs');
    // We don't have a pdf file here easily, but we can check if it's a constructor or function
} catch (e) {
    console.log('Error:', e.message);
}
