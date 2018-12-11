let configMode = 'development';

if (!process.env.NODE_ENV) {
  process.stdout.write(
    'Config provider might face difficulties since process.env.NODE_ENV was not defined',
  );
} else {
  configMode = process.env.NODE_ENV;
}

// eslint-disable-next-line import/no-dynamic-require
const mainConfiguration = require(`./config/${configMode}`);

const configurationManager = new Proxy(mainConfiguration, {
  get(target, property) {
    if (target[property]) return target[property];
    process.stdout.write(`Access to missing configuration: '${property}'!`);
    return null;
  },
});

module.exports = configurationManager;
