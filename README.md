This is a small money transfer app where users can do the following (Backend API Endpoints
only)
1. Sign up and log in (authentication)
2. Generate a unique bank account that can accept deposits via bank transfer
3. Receiving notification for bank transfers done at the above step should be powered
using webhooks. You can use webhook.site to generate your webhook URL on the atlas
to see the webhook payload when it is sent across; use postman to test your webhook
endpoint to ensure it works correctly when deployed to an environment
4. An endpoint that can enable the users to send money to other banks(powered by Raven
atlas API)
5. Endpoints that can retrieve users' deposits, transfers, and transactions history

6. code stack - node.js, express.js
