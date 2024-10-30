const dotenv = require('dotenv');
dotenv.config();

const apiId = process.env.API_ID;
const apiHash = process.env.API_HASH;
const stringSession23 = new StringSession(process.env.STRING_SESSION);