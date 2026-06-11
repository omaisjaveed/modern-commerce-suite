// 1. Load environment variables at the ABSOLUTE BEGINNING
const path = require('path');
const dotenv = require('dotenv');

// Pre-load .env from root
dotenv.config({ path: path.join(__dirname, '.env') });

// 2. Start the application
console.log("Phusion Passenger: Starting Backend with pre-loaded environment...");
require('./dist/index.js');
