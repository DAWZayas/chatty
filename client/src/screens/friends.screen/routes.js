import FriendsContainer from './containers/friends';
import BlackListFromMeContainer from './containers/blacklistFromMe';
import BlackListToMeContainer from './containers/blacklistToMe';
import FriendInvitationFromMeContainer from './containers/invitationsFromMe';
import FriendInvitationToContainer from './containers/invitationsToMe';

const routes = {
  MyFriends: {
    key: 'MyFriends',
    title: 'Friends',
    color: 'blue',
    actions: ['to-blacklist', 'remove-friend'],
    Screen: FriendsContainer,
    emptyMessage: 'Yo do not have friends',
  },
  InvitationsToMe: {
    key: 'InvitationsToMe',
    title: 'Invitations',
    color: 'green',
    actions: ['cancel-invitation-to-me', 'accept-invitation'],
    Screen: FriendInvitationToContainer,
    emptyMessage: 'Yo do not have invitations',
  },
  InvitationsFromMe: {
    key: 'InvitationsFromMe',
    title: 'Your invitations',
    color: 'red',
    actions: ['cancel-invitation-from-me'],
    Screen: FriendInvitationFromMeContainer,
    emptyMessage: 'No invitation issued by you pending acceptance.',
  },
  BlackListFromMe: {
    key: 'BlackListFromMe',
    title: 'Your Blacklist',
    color: 'black',
    actions: ['remove-from-blacklist'],
    Screen: BlackListFromMeContainer,
    emptyMessage: 'There is nobody on the blacklist',
  },
  BlackListToMe: {
    key: 'BlackListToMe',
    title: 'Banned by',
    color: 'brown',
    actions: [],
    Screen: BlackListToMeContainer,
    emptyMessage: 'You are not on the blacklist of anyone',
  },
};

export default routes;
