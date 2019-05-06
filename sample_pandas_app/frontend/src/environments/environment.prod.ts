import { envVars } from './buildSettings';

export const environment = {
  production: true,
  configSettings: {
    apiURL: `http://${envVars.prodUrl}:${envVars.prodPort}/api/`
  }
};
