const pdf = require('pdf-parse');
console.log('Main require type:', typeof pdf);
console.log('Main require keys:', Object.keys(pdf || {}));

const pdfLib = require('pdf-parse/lib/pdf-parse.js');
console.log('Lib require type:', typeof pdfLib);
console.log('Lib require keys:', Object.keys(pdfLib || {}));
