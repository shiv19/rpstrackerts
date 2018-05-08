enum PROJ_ENV {
  PRODUCTION = 'PRODUCTION',
  DEVELOPMENT = 'DEVELOPMENT'
}

const projectEnvironment: PROJ_ENV = PROJ_ENV.DEVELOPMENT;

export let appConfig = null;

if ((PROJ_ENV.PRODUCTION as PROJ_ENV) === (projectEnvironment as PROJ_ENV)) {
  // Offer production stage environment variables
  // module.exports = require('./app.config.prod.json');
  appConfig = require('./app.config.prod.json');
} else if (
  (PROJ_ENV.DEVELOPMENT as PROJ_ENV) === (projectEnvironment as PROJ_ENV)
) {
  // Offer dev stage settings data
  // module.exports = require('./app.config.dev.json');
  appConfig = require('./app.config.dev.json');
}
