import { gql } from 'apollo-server';

export const typeDefs = gql`
  # declare custom scalars
  scalar Date

  # input for creating messages
  # text is the message text
  # userId is the id of the user sending the message
  # groupId is the id of the group receiving the message
  input CreateMessageInput {
    groupId: Int!
    text: String!
  }

  # input for creating groups
  input CreateGroupInput {
    name: String!
    userIds: [Int!]
    userId: Int!
  }

  # input for updating groups
  input UpdateGroupInput {
    id: Int!
    name: String
  }

  # input for creating friend invitations
  input CreateFriendInvitationInput {
    from: Int! # user id of the user who sends invitation
    to: Int! # user id for which the invitation is
    text: String # invitation text
  }

  # input for relay cursor connections
  input ConnectionInput {
    first: Int
    after: String
  }

  type MessageConnection {
    edges: [MessageEdge]
    pageInfo: PageInfo!
  }

  type MessageEdge {
    cursor: String!
    node: Message!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  # a group chat entity
  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    users: [User!]! # users in the group
    messages(messageConnection: ConnectionInput): MessageConnection # messages sent to the group
  }
  # a user -- keep type really simple for now
  type User {
    id: Int! # unique id for the user
    email: String! # we will also require a unique email per user
    username: String # this is the name we'll show other users
    messages: [Message!]! # messages sent by user
    groups: [Group!]! # groups the user belongs to
    friends: [User!]! # user's friends/contacts
    jwt: String # json web token for access
  }
  # a message sent from a user to a group
  type Message {
    id: Int! # unique id for message
    to: Group! # group message was sent in
    from: User! # user who sent the message
    text: String! # message text
    createdAt: Date! # when message was created
  }

  # a friend invitation send from one user to another
  type FriendInvitation {
    id: Int! # unique id for invitation
    to: User! # user that has been invited
    from: User! # user who sent the message
    text: String! # invitation message text
  }

  # black list between two users
  type BlackList {
    id: Int! # unique id for black list
    to: User! # user in the black list
    from: User! # user who makes the action
  }

  # query for types
  type Query {
    # Return a user by their email or id
    user(email: String, id: Int): User
    # Return messages sent by a user via userId
    # Return messages sent to a group via groupId
    messages(groupId: Int, userId: Int): [Message]
    # Return a group by its id
    group(id: Int!): Group

    # Return friend invitations from and to an user
    friendInvitations(userId: Int!): [FriendInvitation]
    # me black list
    blackList(userId: Int!): [BlackList]
  }
  type Mutation {
    # send a message to a group
    createMessage(message: CreateMessageInput!): Message

    # group CRUD
    createGroup(group: CreateGroupInput!): Group
    deleteGroup(id: Int!): Group
    leaveGroup(id: Int!, userId: Int!): Group # let user leave group
    updateGroup(group: UpdateGroupInput!): Group

    # friend invitation CRUD
    createFriendInvitation(invitation: CreateFriendInvitationInput!): FriendInvitation
    cancelFriendInvitation(from: Int!, to: Int!): Boolean
    acceptFriendInvitation(from: Int!, to: Int!): User

    deleteFriend(from: Int!, to: Int!): User

    addToBlackList(from: Int!, to: Int!): BlackList
    removeFromBlackList(from: Int!, to: Int!): Boolean

    login(email: String!, password: String!): User
    signup(email: String!, password: String!, username: String): User
  }

  type Subscription {
    # Subscription fires on every message added
    # for any of the groups with one of these groupIds
    messageAdded(userId: Int, groupIds: [Int]): Message
    groupAdded(userId: Int): Group
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

export default typeDefs;
