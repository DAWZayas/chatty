import GraphQLDate from 'graphql-date';
import {
  BlackList, FriendInvitation, Group, Message, User,
} from './connectors';

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
    friendInvitations(_, { userId }) {
      return FriendInvitation.findAll({
        where: { $or: [{ fromId: userId }, { toId: userId }] },
        order: [['createdAt']],
      });
    },
    blackList(_, { userId }) {
      return BlackList.findAll({
        where: { $or: [{ fromId: userId }, { toId: userId }] },
        order: [['createdAt']],
      });
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
      const friends = await user.getFriends({
        where: { id: { $in: userIds } },
      });
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
    async createFriendInvitation(
      _,
      {
        invitation: { text, from, to },
      },
    ) {
      const user = await User.findOne({ where: { id: from } });
      const friends = await user.getFriends({ where: { id: to } });

      if (friends && friends.length) {
        throw new Error(`user ${to} is already friend of ${from}`);
      }

      const previousInvitation = await FriendInvitation.findOne({
        where: { $or: [{ fromId: from, toId: to }, { fromId: to, toId: from }] },
      });

      if (previousInvitation) {
        throw new Error(
          `There is already an invitation between ${to} and ${from}`,
        );
      }

      const inBlackList = await BlackList.findOne({
        where: { $or: [{ fromId: from, toId: to }, { fromId: to, toId: from }] },
      });

      if (inBlackList) {
        throw new Error(
          `Users ${to} and ${from} are in black list`,
        );
      }
      
      const invitation = await FriendInvitation.create({
        fromId: from,
        toId: to,
        text,
      });

      return invitation;
    },
    cancelFriendInvitation(_, { from, to }) {
      return FriendInvitation.destroy({ where: { fromId: from, toId: to } });
    },
    async acceptFriendInvitation(_, { from, to }) {
      const fromUser = await User.findOne({ where: { id: from } });
      const toUser = await User.findOne({ where: { id: to } });
      const invitationExists = await FriendInvitation.destroy({
        where: { fromId: from, toId: to },
      });

      if (invitationExists) {
        await fromUser.addFriend(toUser);
        await toUser.addFriend(fromUser);
      }
      return toUser;
    },
    async deleteFriend(_, { from, to }) {
      const fromUser = await User.findOne({ where: { id: from } });
      const toUser = await User.findOne({ where: { id: to } });
      await fromUser.removeFriend(toUser);
      await toUser.removeFriend(fromUser);
      return fromUser;
    },
    async addToBlackList(_, { from, to }) {
      const fromUser = await User.findOne({ where: { id: from } });
      const toUser = await User.findOne({ where: { id: to } });
      await fromUser.removeFriend(toUser);
      await toUser.removeFriend(fromUser);
      await FriendInvitation.destroy({
        where: { fromId: from, toId: to },
      });
      await FriendInvitation.destroy({
        where: { fromId: to, toId: from },
      });
      return BlackList.create({
        fromId: from,
        toId: to,
      });
    },
    removeFromBlackList(_, { from, to }) {
      return BlackList.destroy({ where: { fromId: from, toId: to } });
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
  FriendInvitation: {
    async from(invitation) {
      return invitation.getFrom();
    },
    async to(invitation) {
      return invitation.getTo();
    },
  },
  BlackList: {
    async from(blackList) {
      return blackList.getFrom();
    },
    async to(blackList) {
      return blackList.getTo();
    },
  },
};
export default resolvers;
