import R from 'ramda';
import faker from 'faker';
import bcrypt from 'bcrypt';
import { db } from './connectors';

// create fake starter data
const GROUPS = 4;
const USERS_PER_GROUP = 5;
const MESSAGES_PER_USER = 5;

faker.seed(123); // get consistent data every time we reload app

// you don't need to stare at this code too hard
// just trust that it fakes a bunch of groups, users, and messages

const mockDB = async ({ populating = true, force = true } = {}) => {
  console.log('creating database....');
  await db.sync({ force });

  if (!populating) {
    return Promise.resolve(true);
  }

  console.log('populating groups....');
  const groups = await Promise.all(
    R.times(
      () => db.models.group.create({
        name: faker.lorem.words(3),
      }),
      GROUPS,
    ),
  );

  console.log('populating users....');
  const usersGroups = await Promise.all(
    R.map(async (group) => {
      const users = await Promise.all(
        R.times(async () => {
          const email = faker.internet.email();
          const hash = await bcrypt.hash(email, 10);
          const user = await group.createUser({
            email,
            username: faker.internet.userName(),
            password: hash,
          });
          await Promise.all(
            R.times(
              () => db.models.message.create({
                userId: user.id,
                groupId: group.id,
                text: faker.lorem.sentences(3),
              }),
              MESSAGES_PER_USER,
            ),
          );
          return user;
        }, USERS_PER_GROUP),
      );
      return users;
    }, groups),
  );

  console.log('populating friends....');
  await Promise.all(
    R.flatten(
      R.map(
        users => users.map((current, i) => users.map((user, j) => (i !== j ? current.addFriend(user) : false))),
        usersGroups,
      ),
    ),
  );

  console.log('¡DATABASE CREATED!');

  return true;
};

export default mockDB;
