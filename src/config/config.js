const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  apiId: process.env.API_ID,
  apiHash: process.env.API_HASH,
  stringSession: process.env.STRING_SESSION,
};
