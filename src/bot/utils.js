const axios = require("axios");

async function postWithFallback(url, data, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      if (attempt === retries - 1) {
        console.error('All retry attempts failed:', error.message);
      }
    }
  }
}

module.exports = { postWithFallback };
