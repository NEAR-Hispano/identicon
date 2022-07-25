require('dotenv').config();

// Check for mandatory environment variables
const required = [
  'NODE_ENV',
  'EXPRESS_PORT',
  'API_VERSION',
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'DB_PASS',
  'DB_PATH'
];

required.forEach(param => {
  if (!process.env[param]) {
    throw new Error(`Environment parameter ${param} is missing`);
  }
});

const DEFAULT_LANGUAGES = {
  'ar': 'es'
};

const config = {
  // general config.
  general: {
    env: process.env.NODE_ENV,
    port: process.env.EXPRESS_PORT,
    api_version: process.env.API_VERSION
  },

  countryLanguages: {
    'ar': 'es'
  },

  database: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    path: process.env.DB_PATH
  }
};

module.exports = config;
