// Credit to github.com/nbmsacha for initial implementation.

Use the `.env.example` placeholders as a guide.

### `.env.example`

#### Instructions

1. **Copy the Template**: Duplicate the `.env.example` file and rename it to `.env`.

2. **Fill in the Values**: Replace the placeholder values (e.g., `your_api_id`, `yourpassword`) with your actual configuration values.

3. **Secure the File**: Ensure that the `.env` file is added to your `.gitignore` to prevent it from being committed to version control. This is crucial for keeping sensitive information secure.

4. **Load Environment Variables**: Use a package like `dotenv` in your Node.js application to load these variables. Typically, you would add the following line at the top of your main entry file (e.g., `app.js` or `server.js`):

   ```javascript
   require('dotenv').config();
   ```

5. **Run Your Application**: Start your application as usual. The environment variables will be available via `process.env`.