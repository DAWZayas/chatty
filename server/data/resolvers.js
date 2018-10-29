import GraphQLDate from 'graphql-date';
import { Group, Message, User } from './connectors';

export const resolvers = {
  Date: GraphQLDate,
  Query: {
    group(_, args) {
      return Group.find({ where: args });
    },
    messages(_, args) {
      return Message.findAll({
        where: args,
        order: [['createdAt', 'DESC']],
      });
    },
    user(_, args) {
      return User.findOne({ where: args });
    },
  },
  Mutation: {
    createMessage(
      _,
      {
        message: { text, userId, groupId },
      },
    ) {
      return Message.create({
        userId,
        text,
        groupId,
      });
    },
    async createGroup(
      _,
      {
        group: { name, userIds, userId },
      },
    ) {
      const user = await User.findOne({ where: { id: userId } });
      const friends = await user.getFriends({ where: { id: { $in: userIds } } });
      const group = await Group.create({
        name,
        users: [user, ...friends],
      });
      await group.addUsers([user, ...friends]);
      return group;
    },
    async deleteGroup(_, { id }) {
      const group = await Group.findOne({ where: id });
      const users = await group.getUsers();
      await group.removeUsers(users);
      await Message.destroy({ where: { groupId: group.id } });
      await group.destroy();
      return group;
    },
    async leaveGroup(_, { id, userId }) {
      const group = await Group.findOne({ where: { id } });
      await group.removeUser(userId);
      const users = await group.getUsers();
      if (!users.length) {
        await group.destroy();
      }
      return group;
    },
    updateGroup(
      _,
      {
        group: { id, name },
      },
    ) {
      return Group.findOne({ where: { id } }).then(group => group.update({ name }));
    },
  },
  Group: {
    users(group) {
      return group.getUsers();
    },
    messages(group) {
      return Message.findAll({
        where: { groupId: group.id },
        order: [['createdAt', 'DESC']],
      });
    },
  },
  Message: {
    to(message) {
      return message.getGroup();
    },
    from(message) {
      return message.getUser();
    },
  },
  User: {
    messages(user) {
      return Message.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });
    },
    groups(user) {
      return user.getGroups();
    },
    friends(user) {
      return user.getFriends();
    },
  },
};
export default resolvers;
