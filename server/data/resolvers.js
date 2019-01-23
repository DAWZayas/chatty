import R from 'ramda';
import GraphQLDate from 'graphql-date';
import { withFilter } from 'apollo-server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  BlackList, FriendInvitation, Group, Message, User,
} from './connectors';
import { pubsub } from '../subscriptions';
import { messageLogic } from './logic';

import configurationManager from '../configurationManager';

const JWT_SECRET = configurationManager.jwt.secret;

const MESSAGE_ADDED_TOPIC = 'messageAdded';
const GROUP_ADDED_TOPIC = 'groupAdded';

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
    createMessage(_, args, ctx) {
      return messageLogic.createMessage(_, args, ctx).then((message) => {
        // Publish subscription notification with message
        pubsub.publish(MESSAGE_ADDED_TOPIC, { [MESSAGE_ADDED_TOPIC]: message });
        return message;
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

      // append the user list to the group object
      // to pass to pubsub so we can check members
      group.users = [user, ...friends];
      pubsub.publish(GROUP_ADDED_TOPIC, { [GROUP_ADDED_TOPIC]: group });

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
      if (from === to) {
        throw new Error('You can not invite yourself');
      }
      const userFrom = await User.findOne({ where: { id: from } });

      if (!userFrom) {
        throw new Error(`There is no user with id: ${from}`);
      }
      const friends = await userFrom.getFriends({ where: { id: to } });

      if (friends && friends.length) {
        throw new Error(`user ${to} is already friend of ${from}`);
      }

      const previousInvitation = await FriendInvitation.findOne({
        where: { $or: [{ fromId: from, toId: to }, { fromId: to, toId: from }] },
      });

      if (previousInvitation) {
        throw new Error(`There is already an invitation between ${to} and ${from}`);
      }

      const inBlackList = await BlackList.findOne({
        where: { $or: [{ fromId: from, toId: to }, { fromId: to, toId: from }] },
      });

      if (inBlackList) {
        throw new Error(`Users ${to} and ${from} are in black list`);
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
      if (from === to) {
        throw new Error('You can not bane yourself');
      }
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
    login(_, { email, password }, ctx) {
      // find user by email
      return User.findOne({ where: { email } }).then((user) => {
        if (user) {
          // validate password
          return bcrypt.compare(password, user.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                },
                JWT_SECRET,
              );
              ctx.user = Promise.resolve(user);
              user.jwt = token; // eslint-disable-line no-param-reassign
              return user;
            }
            return Promise.reject(new Error('password incorrect'));
          });
        }
        return Promise.reject(new Error('email not found'));
      });
    },
    signup(_, { email, password, username }, ctx) {
      // find user by email
      return User.findOne({ where: { email } }).then((existing) => {
        if (!existing) {
          // hash password and create user
          return bcrypt
            .hash(password, 10)
            .then(hash => User.create({
              email,
              password: hash,
              username: username || email,
            }))
            .then((user) => {
              const { id } = user;
              const token = jwt.sign({ id, email }, JWT_SECRET);
              ctx.user = Promise.resolve(user);
              user.jwt = token; // eslint-disable-line no-param-reassign
              return user;
            });
        }
        return Promise.reject(new Error('email already exists')); // email already exists
      });
    },
  },
  Subscription: {
    messageAdded: {
      // the subscription payload is the message.
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED_TOPIC),
        (payload, args) => Boolean(
          args.groupIds
              && ~args.groupIds.indexOf(payload.messageAdded.groupId)
              && args.userId !== payload.messageAdded.userId, // don't send to user creating message
        ),
      ),
    },
    groupAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(GROUP_ADDED_TOPIC),
        (payload, args) => Boolean(
          args.userId
              && ~R.pluck('id', payload.groupAdded.users).indexOf(args.userId)
              && args.userId !== payload.groupAdded.users[0].id, // don't send to user creating group
        ),
      ),
    },
  },
  Group: {
    users(group) {
      return group.getUsers();
    },
    messages(group, { messageConnection = {} }) {
      const { first, after } = messageConnection;

      // base query -- get messages from the right group
      const where = { groupId: group.id };

      // because we return messages from newest -> oldest
      // after actually means older (id < cursor)

      if (after) {
        where.id = { $lt: Buffer.from(after, 'base64').toString() };
      }

      return Message.findAll({
        where,
        order: [['id', 'DESC']],
        limit: first,
      }).then((messages) => {
        const edges = messages.map(message => ({
          cursor: Buffer.from(message.id.toString()).toString('base64'), // convert id to cursor
          node: message, // the node is the message itself
        }));

        return {
          edges,
          pageInfo: {
            hasNextPage() {
              if (messages.length < first) {
                return Promise.resolve(false);
              }

              return Message.findOne({
                where: {
                  groupId: group.id,
                  id: {
                    $lt: messages[messages.length - 1].id,
                  },
                },
                order: [['id', 'DESC']],
              }).then(message => !!message);
            },
            hasPreviousPage() {
              return Message.findOne({
                where: {
                  groupId: group.id,
                  id: where.id,
                },
                order: [['id']],
              }).then(message => !!message);
            },
          },
        };
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
