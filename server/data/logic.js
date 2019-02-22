import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { Message, UserProfile } from './connectors';
// reusable function to check for a user with context
function getAuthenticatedUser(ctx) {
  return ctx.user.then((user) => {
    if (!user) {
      throw new AuthenticationError('Unauthenticated');
    }
    return user;
  });
}

export const messageLogic = {
  createMessage(
    _,
    {
      message: { text, groupId },
    },
    ctx,
  ) {
    return getAuthenticatedUser(ctx).then(user => user.getGroups({ where: { id: groupId }, attributes: ['id'] }).then((group) => {
      if (group.length) {
        return Message.create({
          userId: user.id,
          text,
          groupId,
        });
      }
      throw new ForbiddenError('Unauthorized');
    }));
  },
};

export const profileLogic = {
  updateProfile(
    _,
    {
      profile: { color },
    },
    ctx,
  ) {
    return getAuthenticatedUser(ctx).then((user) => {
      if (user) {
        return UserProfile.findOne({ where: { userId: user.id } }).then(profile => profile.update({ color }));
      }
      throw new ForbiddenError('Unauthorized');
    });
  },
};

export const groupLogic = {};
