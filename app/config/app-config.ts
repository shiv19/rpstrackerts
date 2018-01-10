enum PROJ_ENV {
    PRODUCTION = "PRODUCTION",
    DEVELOPMENT = "DEVELOPMENT"
}

const projectEnvironment: PROJ_ENV = PROJ_ENV.DEVELOPMENT;

if ((PROJ_ENV.PRODUCTION as PROJ_ENV) === (projectEnvironment as PROJ_ENV)) {
    // Offer production stage environment variables
    console.log("in staging mode");
    module.exports = require("./app.config.prod.json");
} else if (
    (PROJ_ENV.DEVELOPMENT as PROJ_ENV) === (projectEnvironment as PROJ_ENV)
) {
    // Offer dev stage settings data
    console.log("in development mode");
    module.exports = require("./app.config.dev.json");
}
