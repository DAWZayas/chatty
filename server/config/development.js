const db = [
  'chatty',
  null,
  null,
  {
    dialect: 'sqlite',
    storage: './chatty.sqlite',
    logging: true, // mark this true if you want to see logs
  },
];

const graphQL = {
  port: 8080,
};

const jwt = {
  secret: '123abc',
};

const mock = { populating: false, force: false };

export default {
  db,
  graphQL,
  jwt,
  mock,
};
