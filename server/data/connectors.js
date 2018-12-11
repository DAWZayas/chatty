import Sequelize from 'sequelize';
import configurationManager from '../configurationManager';

// initialize our database
const db = new Sequelize(...configurationManager.db);
// define groups
const GroupModel = db.define('group', {
  name: { type: Sequelize.STRING },
});
// define messages
const MessageModel = db.define('message', {
  text: { type: Sequelize.STRING },
});
// define users
const UserModel = db.define('user', {
  email: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
});

// define friend invitations
const FriendInvitationModel = db.define('friendInvitation', {
  text: { type: Sequelize.STRING },
});

// define black list model
const BlackListModel = db.define('blackList', {});

// users belong to multiple groups
UserModel.belongsToMany(GroupModel, { through: 'GroupUser' });
// users belong to multiple users as friends
UserModel.belongsToMany(UserModel, { through: 'Friends', as: 'friends' });
// messages are sent from users
MessageModel.belongsTo(UserModel);
// messages are sent to groups
MessageModel.belongsTo(GroupModel);
// groups have multiple users
GroupModel.belongsToMany(UserModel, { through: 'GroupUser' });

FriendInvitationModel.belongsTo(UserModel, { as: 'from' });
FriendInvitationModel.belongsTo(UserModel, { as: 'to' });

BlackListModel.belongsTo(UserModel, { as: 'from' });
BlackListModel.belongsTo(UserModel, { as: 'to' });

const Group = db.models.group;
const Message = db.models.message;
const User = db.models.user;
const FriendInvitation = db.models.friendInvitation;
const BlackList = db.models.blackList;

export {
  db, Group, Message, User, FriendInvitation, BlackList,
};
