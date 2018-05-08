type ProjEnv = 'Dev' | 'Prod';

const env: ProjEnv = 'Dev';

export let appConfig = null;

if (env === 'Dev') {
  // Offer dev stage settings data
  // module.exports = require('./app.config.dev.json');
  appConfig = require('./app.config.dev.json');
} else if (env === 'Prod') {
  // Offer production stage environment variables
  // module.exports = require('./app.config.prod.json');
  appConfig = require('./app.config.prod.json');
}
