URL Metadata Fetcher

This is a web application that allows users to input a list of URLs, fetch metadata (including the title, description, and an image) for each URL, and display the results on the front-end. The application is built with a React front-end and a Node.js back-end.
Features:
    - Input Multiple URLs: Users can input 3 URLs at a time.
    - Fetch Metadata: The application fetches metadata (title, description, image) for each URL.
    - Display Results: The metadata is displayed in a visually appealing manner.
    - Error Handling: Proper error handling for invalid URLs or cases where metadata cannot be retrieved.
    - Rate Limiting: Server-side rate limiting is implemented to handle a maximum of 5 requests per second.
    - Security: The application is secure against common web vulnerabilities such as XSS and CSRF.

Prerequisites:
- Node.js: Ensure that Node.js is installed on your machine.
- npm: Node Package Manager comes with Node.js and is needed to install dependencies.

For installation clone the repository:
git clone https://github.com/your-username/metadata-app.git
cd metadata-app

Install dependencies:  
- cd server
- npm install

Install client dependencies:
- cd ../client
- npm install

Running the Application Locally
 - Start the back-end server:
cd server
npm start

The server will run on http://localhost:5000.

- Start the front-end React application:
cd ../client
npm start

The React application will run on http://localhost:3000.

The application is deployed on Vercel. You can access the live version using the following link:

https://metadata-app-plum.vercel.app/

Usage:

 - Open the deployed application in your browser.
 - Input 3 URLs into the form.
 - Click the "Submit" button to fetch and display the metadata for each URL.

Error Handling:
- The front-end will alert users if an invalid URL is submitted.
- If metadata cannot be fetched for a valid URL, an appropriate message will be displayed.
- The server is protected against network issues and invalid URLs, returning error responses when necessary.

The server is configured to handle a maximum of 5 requests per second to prevent abuse. If the limit is exceeded, the server will respond with a 429 Too Many Requests status.
Cross-Site Scripting (XSS): The application sanitizes user inputs to prevent XSS attacks. Cross-Site Request Forgery (CSRF): CSRF protection is implemented on the server to secure forms and API requests.
