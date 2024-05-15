# Security
Using Firebase for Auth and Firestore for a database ensures that the data is secure and can be accessed only by the authenticated users.
Furthermore there are [firestore.rules] added which ensures data manipulation is controlled.

NPM Audit was run to check for any vulnerabilities.
Types were added to ensure type safety.

API keys are stored in firebase config
All third party calls are happening on the server side(Cloud functions).

