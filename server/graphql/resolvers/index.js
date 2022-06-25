const authResolvers= require('./auth');
const eventResolvers= require('./event');
const bookingResolvers= require('./booking');
const roleResolvers= require('./role');

const rootResolver={
    ...authResolvers,
    ...eventResolvers,
    ...bookingResolvers,
    ...roleResolvers
};

module.exports=rootResolver;