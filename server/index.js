const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const cors = require("cors");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/isAuth");
const roleGurd = require("./middleware/roleGurd");

const graphqlHTTP = require("express-graphql").graphqlHTTP;

app.use(bodyParser.json());

const corsOptions={
    origin: ['https://graphql-client-cyan.vercel.app/', 'http://localhost:3000/'],
    credentials: true,
  }
  app.use(cors(corsOptions));


app.use(isAuth);
app.use(roleGurd);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log("connection error", err);
  });

  server.applyMiddleware({
    app,
    path: '/',
    cors: false, // disables the apollo-server-express cors to allow the cors middleware use
  })
app.listen(port||4000, () => {
  console.log(`This site is running on http://localhost:${port}`);
});
