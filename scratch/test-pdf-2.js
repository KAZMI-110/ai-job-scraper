try {
    const pdf = require('pdf-parse');
    console.log('Main require type:', typeof pdf);
    console.log('Main require keys:', Object.keys(pdf || {}));
    if (typeof pdf === 'function') console.log('Main is function');
} catch (e) {
    console.log('Main require failed:', e.message);
}
