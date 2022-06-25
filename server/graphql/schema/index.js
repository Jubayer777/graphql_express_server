const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Booking{
    _id:ID!
    event:Event!
    user:User!
    status:String!
    createdAt:String!
    updatedAt:String!
}
type Event{
    _id:ID!
    title:String!
    description:String!
    price:Float!
    date:String!
    creator:User
}
type User{
     _id:ID!
     email:String!
     password:String
     accessToken:String!
     role:Role
     createdEvents:[Event!]
 }
type Role{
    _id:ID!
    title:String!
    users:[User!]
}
input EventInput{
     title:String!
     description:String!
     price:Float!
     date:String!
}
input UpdateEventInput{
    title:String
    description:String
    price:Float
    date:String,
    eventId:ID!
}
input UserInput{
     email:String!
     password:String!
 }
 input UpdateBookingInput{
    bookingId:ID!
    status:String!
}

input UserRoleInput{
    userId:ID!
    roleId:ID!
}

type RootQuery{
     events:[Event!]!
     users:[User!]!
     bookings:[Booking!]!
     roles:[Role!]!
     bookingsByUser(userId:ID!):[Booking!]!
     loginUser(userInput:UserInput):User
     event(eventId:ID!):Event!
}
type RootMutation{
   createEvent(eventInput:EventInput):Event
   deleteEvent(eventId:ID!):String
   updateEvent(eventInput:UpdateEventInput):Event
   createUser(userInput:UserInput):User
   deleteUser(userId:ID!):String
   bookEvent(eventId:ID!):Booking!
   cancelBooking(bookingId:ID!):String
   updateBooking(bookingInput:UpdateBookingInput):String
   createRole(roleName:String!):Role!
   updateUserRole(userRoleInput:UserRoleInput):String
}
schema{
    query:RootQuery
    mutation:RootMutation
}
`);
