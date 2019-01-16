const db = [
  'postgres://bonseref:gvzVz9-z8lmF9WoxpcrLPlRzkOa439NE@pellefant.db.elephantsql.com:5432/bonseref',
  {
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
