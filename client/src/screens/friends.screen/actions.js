import acceptFriendInvitation from './containers/acceptFriendInvitation';
import cancelFriendInvitationToMe from './containers/cancelFriendInvitationToMe';
import cancelFriendInvitationFromMe from './containers/cancelFriendInvitationFromMe';
import addToBlackList from './containers/addToBlackList';
import removeFromBlackList from './containers/removeFromBlackList';
import deleteFriend from './containers/deleteFriend';

const actions = [
  {
    action: 'accept-invitation',
    name: 'plus-circle',
    color: 'green',
    style: {
      backgroundColor: 'white',
    },
    actionHOC: acceptFriendInvitation,
  },
  {
    action: 'cancel-invitation-from-me',
    name: 'times-circle',
    color: 'red',
    style: {
      backgroundColor: 'white',
    },
    actionHOC: cancelFriendInvitationFromMe,
  },
  {
    action: 'cancel-invitation-to-me',
    name: 'times-circle',
    color: 'red',
    style: {
      backgroundColor: 'white',
    },
    actionHOC: cancelFriendInvitationToMe,
  },
  {
    action: 'to-blacklist',
    name: 'ban',
    color: 'white',
    style: {
      backgroundColor: 'black',
    },
    actionHOC: addToBlackList,
  },
  {
    action: 'remove-from-blacklist',
    name: 'times-circle',
    color: 'white',
    style: {
      backgroundColor: 'red',
    },
    actionHOC: removeFromBlackList,
  },
  {
    action: 'remove-friend',
    name: 'times-circle',
    color: 'white',
    style: {
      backgroundColor: 'red',
    },
    actionHOC: deleteFriend,
  },
];

export default actions;
