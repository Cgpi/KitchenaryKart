/**
 * Environment Configuration Validator
 * Runs on app startup to ensure all required environment variables are set
 */

const requiredEnvVars = [
  'REACT_APP_API_BASE_URL',
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
];

export function validateEnvironment() {
  const missing = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missing.length > 0) {
    const errorMessage = `
❌ CONFIGURATION ERROR - Missing Environment Variables

The following required environment variables are not set:
${missing.map((v) => `  - ${v}`).join('\n')}

SETUP INSTRUCTIONS:
1. Copy .env.example to .env in the root directory
2. Fill in your Firebase credentials in the .env file
3. Restart the development server

File location: ${process.cwd()}/.env
Example file: ${process.cwd()}/.env.example
`;

    console.error(errorMessage);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('✅ Environment validation passed');
}
